# ระบบ POS ด้วยงบ 700 บาท

### พัฒนาโดย นิสิตคณะวิศวกรรมคอมพิวเตอร์ ปี 1 
1. ธนากร สรอุบล 6610502056
2. ธาดา วิยาภรณ์ 6610502081
3. ดนัยพัชร เพ็งกุล 6610505381
4. ธยศ ขันทะยศ 6610505420



### อุปกรณ์ที่ใช้
* ESP32-S3 Devkit 2 ตัว
(ตัวที่ 1 สำหรับเชื่อมกับจอ
,ตัวที่ 2 สำหรับเชื่อมกับ RFID READER เพื่อสแกนบัตร)
* RFID READER 1 ตัว เพื่ออ่านบัตร
* SSD1306 OLED 1 ตัว แสดง QR CODE

### ไลบรารี
- SPI.h
- WiFi.h
- [TFT_eSPI.h](https://github.com/Bodmer/TFT_eSPI)
- [JPEGDecoder.h](https://github.com/Bodmer/JPEGDecoder)
- [WebSocketClient.h](https://github.com/brandenhall/Arduino-Websocket/tree/master)
- [Vue.js](https://github.com/vuejs)
- [firebase](https://github.com/firebase/)
- [Omise](https://github.com/omise)

### ไดเรคตอรี
- server
    - แสดง source code การทำงานของ server
- web
    - แสดง source code การสร้างหน้า website รองรับ responsive
- arduino 
    - แสดง source code การทำงานของ ESP ทั้ง 2 ตัว

### หลักการทำงาน
- การจ่ายเงินด้วย QR
    - เมื่อ user เลือกรายการสินค้าผ่านหน้า website และ คลิกจ่ายเงินด้วย QR ระบบจะส่ง source ID ไปยัง OMISE และทำการ generate QR CODE ของรายการนั้น และส่งกลับไปยัง server จากนั้น server จะส่ง QR ไปแสดงบน esp32-oled โดยมีการแปลงเป็น base64 
    - การเช็คสถานะการชำระเงิน omise จะส่ง webhook มาที่ server และสร้างข้อมูลลง firebase database เมื่อสถานะการชำระเงินเปลี่ยนแปลง และหน้า web จะสร้าง api เข้าไปเช็คสถานะบน database ทุกๆ 5 วินาที เมื่อสถานะเป็น successful จะแสดงให้ user เห็นว่าลูกค้าชำระเงินเรียบร้อย

- การจ่ายด้วย Credit card
    - เมื่อ user เลือกการจ่ายเงินด้วย Credit card ผ่านหน้า website ระบบจะส่งข้อมูลไปยัง server และ ส่งข้อมูลต่อไปยัง esp32 ให้รับหมายเลข token ของ card ด้วย rfid และทำการ createCharge ไปยัง omise เพื่อทำการหักเงินในบัตร เมื่อหักเงินบัตรเสร็จสิ้น omise จะส่ง response กลับมาเป็น status successful และแจ้งให้ user ทราบผ่านหน้า website





<h4 align="center">Introduction to Computer Hardware Development 01204114 <br> Faculty of engineering  Department of computer engineering Kasetsart University</h4>