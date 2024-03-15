#include <WiFi.h>
#include <WebSocketsClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5
#define RST_PIN 23

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* webSocketServer = "https://169172b05c29a5.lhr.life";
bool shouldReadCard = false;

WebSocketsClient webSocket;
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  Serial.println("Connecting to WebSocket Server...");
  webSocket.begin(webSocketServer);
  webSocket.onEvent(webSocketEvent);
  while (!webSocket.connected()) {
    webSocket.loop();
    delay(500);
    Serial.println("Connecting to WebSocket Server...");
  }
  Serial.println("Connected to WebSocket Server");

  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("RFID Reader initialized");
}

void loop() {
  webSocket.loop();
  if (webSocket.connected()) {
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
      String cardID = "";
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        cardID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
        cardID += String(mfrc522.uid.uidByte[i], HEX);
      }
      Serial.println("New card detected: " + cardID);
      webSocket.sendTXT("card-from-esp" + cardID);
      shouldReadCard = false;
    }
  }
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from WebSocket Server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to WebSocket Server");
      break;
    case WStype_TEXT:
      if (strcmp((char *)payload, "CARD READER") == 0) {
        Serial.println("Received command: CARD READER");
        shouldReadCard = true;
      }
      break;
  }
}