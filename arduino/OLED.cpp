#include <WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Base64.h> 

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* webSocketServer = "https://169172b05c29a5.lhr.life";

WebSocketsClient webSocket;

unsigned long lastQRShowTime = 0;
bool showingQR = false;

void setup() {
  Serial.begin(115200);
  
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }

  display.display();
  delay(2000);
  display.clearDisplay();

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
}

void loop() {
  webSocket.loop();
  
  if (showingQR && (millis() - lastQRShowTime >= 20000)) { // แสดง QR ไว้เป็นเวลา 20 วินาที
    showingQR = false;
    display.clearDisplay();
    display.display();
  }
}

void displayQR(const char* base64ImageData) {
  size_t decodedLen = base64_dec_len(base64ImageData, strlen(base64ImageData)); // หาขนาดของข้อมูลภาพหลังจากถูก decode
  uint8_t* decodedData = (uint8_t*)malloc(decodedLen); // สร้าง buffer สำหรับข้อมูลภาพที่ decode แล้ว
  base64_decode(decodedData, base64ImageData, strlen(base64ImageData)); // decode ข้อมูลภาพ base64 เป็นข้อมูลภาพประเภท binary
  
  display.clearDisplay();
  display.drawBitmap(0, 0, decodedData, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();

  free(decodedData); // คืน memory ที่ใช้สำหรับ decodedData
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
      if (strcmp((char *)payload, "show QR") == 0) {
        Serial.println("Received command: show QR");
       if (length > 8 && strncmp((char *)payload, "show QR ", 8) == 0) {
          Serial.println("Received image data.");
          displayQR((char *)payload + 8); 
          lastQRShowTime = millis();
          showingQR = true;
        }
      break;
  }
}