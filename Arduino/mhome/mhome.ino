#include <DallasTemperature.h>
#include <OneWire.h>

#define RELAY_ON LOW
#define RELAY_OFF HIGH

/* ------------------------------------
      MESSAGE AUX
------------------------------------ */

// Temperature
#define AUX_TEMP_ABOVE_ZERO 0
#define AUX_TEMP_BELOW_ZERO 1

// Blind
#define AUX_BLIND_STATUS_IDLE 0
#define AUX_BLIND_STATUS_MOVING_UP 1
#define AUX_BLIND_STATUS_MOVING_DOWN 2

/* ------------------------------------
      COMMANDS
------------------------------------ */

#define CMD_READY 'A' // Arduino is ready to listen for commands
#define CMD_INVALID 'X'
#define CMD_ERROR 'Y' // TODO: Merge INVALID and ERROR into one command?

#define CMD_LIGHT_SET 'S'
#define CMD_LIGHT_QUERY 'L'
#define CMD_LIGHT_RESPONSE 'L'

#define CMD_THERMOMETER_REQUEST 'T'
#define CMD_THERMOMETER_RESPONSE 'T'

#define CMD_BLIND_SET 'B'
#define CMD_BLIND_RESPONSE 'B'

#define CMD_REED_REQUEST 'R'
#define CMD_REED_RESPONSE 'R'

// RequestId to use when message is not a response to request
#define NO_REQUEST_ID "A00"

/* ------------------------------------
      MESSAGE
------------------------------------ */

const byte MESSAGE_LENGTH = 13;
char messageBuffer[MESSAGE_LENGTH];
byte messageIndex = 0;

void resetMessage() {
  messageIndex = 0;
  for (byte i = 0; i < MESSAGE_LENGTH; i++) messageBuffer[i] = '0';
}

String toStringWithLeadingZeros(int number) {
  String str;
  if (number < 10)
    str = "00";
  else if (number < 100)
    str = "0";
  str.concat(String(number));
  return str;
}

void sendMessage(String requestId, char command, int element, int value, int aux) {
  String msg = ">";

  msg.concat(requestId);
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

const byte SWITCHES_SIZE = 1;
const byte LIGHTS_SIZE = 18;
const byte THERMOMETERS_SIZE = 2;
const byte REEDS_SIZE = 1;
const byte BLINDS_SIZE = 2;

const byte ONE_WIRE_BUS = 2; // OneWire pin
#define TEMPERATURE_PRECISION 9

// SWITCHES
const unsigned long SWITCH_DEBOUNCE_TIME = 300;

byte switchesPins[SWITCHES_SIZE] = {7};
byte switchesState[SWITCHES_SIZE] = {LOW}; // the current reading from the input pin
byte previousSwitchesState[SWITCHES_SIZE] = {LOW};
unsigned long switchesTimes[SWITCHES_SIZE] = {0}; // the last time the output pin was toggled

// LIGHTS
byte lights[LIGHTS_SIZE] = {3, 4, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12}; // LIGHTS //TODO: Change this to lightsPin
byte lightsValue[LIGHTS_SIZE];
int mapSwitchToLight[SWITCHES_SIZE] = {0};

// THEREMOMETERS
byte thermometers[THERMOMETERS_SIZE][8] = {
    {0x28, 0x37, 0xF6, 0xBC, 0x8, 0x0, 0x0, 0xEA}, // Wenętrzny
    {0x28, 0x7, 0xEC, 0xBC, 0x8, 0x0, 0x0, 0xC6}   // Zewnętrzny
};

// REEDS
const unsigned long REEDS_DEBOUNCE_TIME = 300;

byte reedsPins[REEDS_SIZE] = {8}; // REED SWTICH
byte reedsState[REEDS_SIZE] = {LOW};
byte previousReedsState[REEDS_SIZE] = {LOW};
unsigned long reedsTimes[REEDS_SIZE] = {0};

// BLINDS
byte blindsPosition[BLINDS_SIZE] = {0, 0};
byte blindsStatus[BLINDS_SIZE] = {AUX_BLIND_STATUS_IDLE, AUX_BLIND_STATUS_IDLE};

unsigned long int lastBlindTime = 0; //TEMP
int requestedBlindPosition = 0;

/* ------------------------------------
      SETUP
------------------------------------ */

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  // Set built in led to be disabled by default
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // Baud rate of 9600 causes errors when receiving large number of messages
  // in short time (eg. when switching all lights on and off)
  Serial.begin(57600);
  sendMessage(NO_REQUEST_ID, CMD_READY, 0, 0, 0);

  // SWITCHES
  for (byte i = 0; i < SWITCHES_SIZE; i++) {
    pinMode(switchesPins[i], INPUT);
  }

  // LIGHTS
  for (byte i = 0; i < LIGHTS_SIZE; i++) {
    pinMode(lights[i], OUTPUT);
    lightsValue[i] = 0;
    digitalWrite(lights[i], RELAY_OFF);
  }

  // THERMOMETERS
  sensors.begin();
  for (byte i = 0; i < THERMOMETERS_SIZE; i++) {
    sensors.setResolution(thermometers[i], TEMPERATURE_PRECISION);
  }

  // REEDS
  for (byte i = 0; i < REEDS_SIZE; i++) {
    pinMode(reedsPins[i], INPUT);
  }
}

/* ------------------------------------
      LOOP
------------------------------------ */

void loop() {
  // SWITHES
  for (byte i = 0; i < SWITCHES_SIZE; i++) {
    switchesState[i] = digitalRead(switchesPins[i]);
    byte lightIndex = mapSwitchToLight[i];
    if (
        switchesState[i] == HIGH &&
        previousSwitchesState[i] == LOW &&
        millis() - switchesTimes[i] > SWITCH_DEBOUNCE_TIME) {
      if (lightsValue[lightIndex] == HIGH)
        setLight(lightIndex, 0);
      else
        setLight(lightIndex, 1);

      switchesTimes[i] = millis();
    }

    previousSwitchesState[i] = switchesState[i];
  }

  // REEDS
  for (byte i = 0; i < REEDS_SIZE; i++) {
    byte state = digitalRead(reedsPins[i]);
    if (state != previousReedsState[i])
      reedsTimes[i] = millis();

    if (millis() - reedsTimes[i] > REEDS_DEBOUNCE_TIME) {
      if (state != reedsState[i]) {
        reedsState[i] = state;
        byte value = state == LOW ? 0 : 1;
        sendMessage(NO_REQUEST_ID, CMD_REED_RESPONSE, i, value, 0);
      }
    }

    previousReedsState[i] = state;
  }

  // BLINDS
  if (blindsStatus[0] != AUX_BLIND_STATUS_IDLE && millis() - lastBlindTime > 3000) {
    blindsPosition[0] = requestedBlindPosition;
    blindsStatus[0] = AUX_BLIND_STATUS_IDLE;
    sendMessage(NO_REQUEST_ID, CMD_BLIND_RESPONSE, 0, blindsPosition[0], blindsStatus[0]);
  }

  // SERIAL
  if (Serial.available() > 0) {
    char received = Serial.read();
    switch (received) {
      case '>':
        messageIndex = 0;
        break; // TODOL: Check if previous msg was correct
      case '<':
        if (messageIndex != MESSAGE_LENGTH) { // Message too short
          invalidMessage();
          return;
        }
        processMessage();
        break;
      default:
        if (messageIndex > MESSAGE_LENGTH - 1) { // Exceded message length, invalid message
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
  char requestId[4];
  char command = messageBuffer[3];
  char element[4];
  char value[4];
  char auxilary[4];

  strncpy(requestId, messageBuffer, 3);
  strncpy(element, messageBuffer + 4, 3);
  strncpy(value, messageBuffer + 7, 3);
  strncpy(auxilary, messageBuffer + 10, 3);

  requestId[3] = '\0';
  element[3] = '\0';
  value[3] = '\0';
  auxilary[3] = '\0';

  int elementId = atoi(element);
  int val = atoi(value);

  switch (command) {
    case CMD_LIGHT_SET:
      setLight(requestId, elementId, val);
      break;
    case CMD_LIGHT_QUERY:
      requestLight(requestId, elementId);
      break;
    case CMD_THERMOMETER_REQUEST:
      requestThermometer(requestId, elementId);
      break;
    case CMD_BLIND_SET:
      setBlind(requestId, elementId, val);
      break;
    default:
      sendMessage(requestId, CMD_ERROR, 0, 0, 0);
      break;
  }
}

void invalidMessage() {
  resetMessage();

  sendMessage(NO_REQUEST_ID, CMD_INVALID, 0, 0, 0);
}

/* ------------------------------------
      HANDLERS
------------------------------------ */

/* ---- LIGHTS ----*/

void requestLight(String requestId, int id) {
  if (id >= LIGHTS_SIZE) { // Invalid element ID
    sendMessage(requestId, CMD_ERROR, id, 0, 0);
    return;
  }

  int value = lightsValue[id];
  sendMessage(requestId, CMD_LIGHT_RESPONSE, id, value, 0);
}

void setLight(int id, int value) {
  setLight(NO_REQUEST_ID, id, value);
}
void setLight(String requestId, int id, int value) {
  if (id >= LIGHTS_SIZE) { // Invalid element ID
    sendMessage(requestId, CMD_ERROR, id, 0, 0);
    return;
  }

  if (value != 0 && value != 1) { // Invalid state
    sendMessage(requestId, CMD_ERROR, 0, value, 0);
    return;
  }

  lightsValue[id] = value;
  bool state = value == 1 ? RELAY_ON : RELAY_OFF;
  digitalWrite(lights[id], state);
  sendMessage(requestId, CMD_LIGHT_RESPONSE, id, value, 0);
}

/* ---- THERMOMETERS ---- */

void requestThermometer(String requestId, int id) {
  if (id >= THERMOMETERS_SIZE) { // Invalid element ID
    sendMessage(requestId, CMD_ERROR, id, 0, 0);
    return;
  }

  sensors.requestTemperatures();
  float tempC = sensors.getTempC(thermometers[id]);
  int intTempC = tempC * 10; // Multiply by 10 to preserve decimal value
  int belowZeroFlag = tempC < 0 ? AUX_TEMP_BELOW_ZERO : AUX_TEMP_ABOVE_ZERO;
  sendMessage(requestId, CMD_THERMOMETER_RESPONSE, id, intTempC, belowZeroFlag);
}

/* ---- BLINDS ---- */

void setBlind(String requestId, int id, int value) {
  if (value > 100) {
    sendMessage(requestId, CMD_ERROR, id, value, 0);
    return;
  }
  int currentPosition = blindsPosition[id];
  blindsPosition[id] = value;
  // TODO: Change status when moving up or down
  lastBlindTime = millis();
  requestedBlindPosition = value;
  blindsStatus[id] = currentPosition < value
                         ? AUX_BLIND_STATUS_MOVING_UP
                         : AUX_BLIND_STATUS_MOVING_DOWN;
  sendMessage(requestId, CMD_BLIND_RESPONSE, id, currentPosition, blindsStatus[id]);
}
