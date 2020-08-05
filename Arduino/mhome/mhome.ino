#include <OneWire.h>
#include <DallasTemperature.h>

#define RELAY_ON LOW
#define RELAY_OFF HIGH

/* ------------------------------------
      COMMANDS
------------------------------------ */

#define CMD_INVALID 'X'
#define CMD_ERROR 'Y' // TODO: Merge INVALID and ERROR into one command?

#define CMD_LIGHT_SET 'S'
#define CMD_LIGHT_QUERY 'L'
#define CMD_LIGHT_RESPONSE 'L'

#define CMD_THERMOMETER_REQUEST 'T'
#define CMD_THERMOMETER_RESPONSE 'T'

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

const byte ONE_WIRE_BUS = 2; // OneWire pin
#define TEMPERATURE_PRECISION 9

byte lights[LIGHTS_SIZE];             // LIGHTS //TODO: Change this to lightsPin
int lightsValue[LIGHTS_SIZE];
byte thermometers[THERMOMETERS_SIZE][8] = {
  { 0x28, 0x37, 0xF6, 0xBC, 0x8, 0x0, 0x0, 0xEA }, // Wenętrzny
  { 0x28, 0x7, 0xEC, 0xBC, 0x8, 0x0, 0x0, 0xC6 }   // Zewnętrzny  
}; 
// THEREMOMETERS
byte reeds[REEDS_SIZE];                // REED SWTICH

/* ------------------------------------
      SETUP
------------------------------------ */

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);

  // LIGHTS
  lights[0] = 3; // LED
  lights[1] = 4; // Some other light

  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);

  for (byte i = 0; i < LIGHTS_SIZE; i++) {
    lightsValue[i] = 0;
    digitalWrite(lights[i], RELAY_OFF);
  }

  // THERMOMETERS
  sensors.begin();
  for (byte i = 0; i < THERMOMETERS_SIZE; i++) {
    sensors.setResolution(thermometers[i], TEMPERATURE_PRECISION);
  }

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

  int id = atoi(element);
  int val = atoi(value);

  switch (command) {
    case CMD_LIGHT_SET: setLight(id, val); break;
    case CMD_LIGHT_QUERY: requestLight(id); break;
    case CMD_THERMOMETER_REQUEST: requestThermometer(id); break;
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
  bool state = value == 1 ? RELAY_ON : RELAY_OFF;
  digitalWrite(lights[id], state);
  sendMessage(CMD_LIGHT_RESPONSE, id, value, 0);
}

/* ---- THERMOMETERS ---- */

void requestThermometer(int id) {
  if (id >= THERMOMETERS_SIZE) { // Invalid element ID
    sendMessage(CMD_ERROR, id, 0, 0);
    return;
  }
  
  sensors.requestTemperatures();
  float tempC = sensors.getTempC(thermometers[id]);
  sendMessage(CMD_THERMOMETER_RESPONSE, id, tempC, 0);
}
