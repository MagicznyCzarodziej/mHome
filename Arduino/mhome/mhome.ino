/* ------------------------------------
      COMMANDS
------------------------------------ */

#define CMD_INVALID 'X'
#define CMD_ERROR 'Y' // TODO: Merge INVALID and ERROR into one command?

#define CMD_LIGHT_SET 'S'
#define CMD_LIGHT_QUERY 'L'
#define CMD_LIGHT_RESPONSE 'L'

#define CMD_THERMOMETER_REQUEST 'T'

#define CMD_BLINDS_SET 'B'
#define CMD_BLINDS_REQUEST 'B'
#define CMD_BLINDS_RESPONSE 'B'

#define CMD_REED_REQUEST 'R'
#define CMD_REED_RESPONSE 'R'

/* ------------------------------------
      MESSAGE
------------------------------------ */

const byte MESSAGE_LENGTH = 10;
char messageBuffer[MESSAGE_LENGTH];
byte messageIndex = 0;

void resetMessage() {
  messageIndex = 0;
  for (byte i = 0; i < MESSAGE_LENGTH; i++) messageBuffer[i] = '0';
}

String toStringWithLeadingZeros(int number) {
  String str;
  if (number < 10) str = "00";
  else if (number < 100) str = "0";
  str.concat(String(number));
  return str;
}

void sendMessage(char command, int element, int value, int aux) {
  String msg = ">";

  msg.concat(command);
  msg.concat(toStringWithLeadingZeros(element));
  msg.concat(toStringWithLeadingZeros(value));
  msg.concat(toStringWithLeadingZeros(aux));

  msg.concat("<");

  Serial.println(msg);
}

/* ------------------------------------
      PINS GROUPS
------------------------------------ */

const byte LIGHTS_SIZE = 2;
const byte THERMOMETERS_SIZE = 2;
const byte REEDS_SIZE = 2;

byte lights[LIGHTS_SIZE];             // LIGHTS //TODO: Change this to lightsPin
int lightsValue[LIGHTS_SIZE];
byte thermometers[THERMOMETERS_SIZE];  // THEREMOMETERS
byte reeds[REEDS_SIZE];                // REED SWTICH

/* ------------------------------------
      SETUP
------------------------------------ */

void setup() {
  Serial.begin(9600);

  /* ---- ASSIGN ELEMENTS TO PINS ---- */
  // Change array size in the section above (PINS GROUPS) before adding new elements

  lights[0] = 3; // LED
  lights[1] = 4; // Some other light

  for (byte i = 0; i < LIGHTS_SIZE; i++) {
    lightsValue[i] = 0;
    pinMode(lights[i], OUTPUT);
  }

  // lights[2] = 5; // Salon/Żyrandol/1
  // lights[3] = 6; // Salon/Żyrandol/2
  // lights[4] = 7; // Salon/Kinkiet
  // lights[5] = 8; // Kuchnia/1
  // lights[6] = 9; // Kuchnia/2
  // ...
  // lights[28] = 31; // 

  // THEREMOMETERS PINS
  // thermometers[0] = 10; // Salon
  // thermometers[1] = 11; // Kuchnia
  // thermometers[2] = 12; // Dwór/1

  // REED SWITCHES PINS
  // reed[0] = 13; // Salon/Okno/1 (Północ)
  // reed[1] = 14; // Salon/Okno/2 (Północ)
  // reed[2] = 15; // Kuchnia/Okno/1

}

/* ------------------------------------
      LOOP
------------------------------------ */

void loop() {
  if (Serial.available() > 0) {
    char received = Serial.read();
    switch (received) {
      case '>': messageIndex = 0; break; // TODOL: Check if previous msg was correct
      case '<':
        if (messageIndex != MESSAGE_LENGTH) { // Message too short
          invalidMessage();
          return;
        }
        processMessage();
        break;
      default: 
        if (messageIndex > MESSAGE_LENGTH-1) { // Exceded message length, invalid message
          invalidMessage();
          return;
        }
        messageBuffer[messageIndex++] = received;
        break;
    }
  }
}

/* ------------------------------------
      PROCESS MESSAGE
------------------------------------ */

void processMessage() {
  char command = messageBuffer[0];
  char element[4];
  char value[4];
  char auxilary[4];
  
  strncpy(element, messageBuffer + 1, 3);
  strncpy(value, messageBuffer + 4, 3);
  strncpy(auxilary, messageBuffer + 7, 3);

  element[3] = '\0';
  value[3] = '\0';
  auxilary[3] = '\0';

  Serial.print(command);
  Serial.print(element);
  Serial.print(value);
  Serial.println(auxilary);

  int id = atoi(element);
  int val = atoi(value);

  switch (command) {
    case CMD_LIGHT_SET: setLight(id, val); break;
    case CMD_LIGHT_QUERY: requestLight(id); break;
    default: sendMessage(CMD_ERROR, 0, 0, 0);
  }
}

void invalidMessage() {
  resetMessage();

  sendMessage(CMD_INVALID, 0, 0, 0);
}

/* ------------------------------------
      HANDLERS
------------------------------------ */

/* ---- LIGHTS ----*/

void requestLight(int id) {
  if (id >= LIGHTS_SIZE) { // Invalid element ID
    sendMessage(CMD_ERROR, id, 0, 0);
    return;
  }

  // int value = digitalRead(id); wrong
  int value = lightsValue[id];
  sendMessage(CMD_LIGHT_RESPONSE, id, value, 0);
}
void setLight(int id, int value) {
  if (id >= LIGHTS_SIZE) { // Invalid element ID
    sendMessage(CMD_ERROR, id, 0, 0);
    return;
  }

  if (value != 0 && value != 1) { // Invalid state
    sendMessage(CMD_ERROR, 0, value, 0);
    return;
  }
  
  lightsValue[id] = value;
  bool state = value == 1 ? HIGH : LOW;
  digitalWrite(lights[id], state);
  sendMessage(CMD_LIGHT_RESPONSE, id, value, 0);
}