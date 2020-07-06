#define CMD_LIGHT_SET 'S'
#define CMD_LIGHT_QUERY 'L'
#define CMD_LIGHT_RESPONSE 'L'
#define CMD_THERMOMETER_REQUEST 'T'
#define CMD_BLINDS_SET 'B'
#define CMD_BLINDS_REQUEST 'B'
#define CMD_BLINDS_RESPONSE 'B'

int lights[2]; // LIGHT PINS

const int MESSAGE_LENGTH = 9;
char messageBuffer[MESSAGE_LENGTH];
int messageIndex = 0;

void setup() {
  Serial.begin(9600);

  // LIGHT PINS
  lights[0] = 3; // LED
  lights[1] = 4; // Some other light
}

void loop() {
  if (Serial.available() > 0) {
    char received = Serial.read();
    switch (received) {
      case '>': messageIndex = 0; break;
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

void invalidMessage() {
  messageIndex = 0;
  Serial.println(">X00000000<");
  
}

void requestLight(int id) {
  Serial.println(id);
}
void setLight(int id, int value) {
  Serial.println(value);
}

void processMessage() {
  char command = messageBuffer[0];
  char element[3];
  char value[4];
  char auxilary[4];
  
  strncpy(element, messageBuffer + 1, 2);
  strncpy(value, messageBuffer + 3, 3);
  strncpy(auxilary, messageBuffer + 6, 3);


  element[2] = '\0';
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
  }
  
}

