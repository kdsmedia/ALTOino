
import { HardwareComponent, ComponentType, ArduinoProject } from './types';

export interface Library {
  name: string;
  version: string;
  author: string;
  description: string;
  category: string;
}

export const POPULAR_LIBRARIES: Library[] = [
  { name: 'Wire', version: '1.0.0', author: 'Arduino', description: 'I2C communication library.', category: 'Communication' },
  { name: 'SPI', version: '1.0.0', author: 'Arduino', description: 'SPI communication library.', category: 'Communication' },
  { name: 'SoftwareSerial', version: '1.0.0', author: 'Arduino', description: 'Serial communication on digital pins.', category: 'Communication' },
  { name: 'ArduinoJson', version: '6.21.2', author: 'Benoit Blanchon', description: 'JSON library for Arduino.', category: 'Utility' },
  { name: 'Adafruit Unified Sensor', version: '1.1.9', author: 'Adafruit', description: 'Base for many Adafruit sensor libraries.', category: 'Sensors' },
  { name: 'DHT sensor library', version: '1.4.4', author: 'Adafruit', description: 'Library for DHT11, DHT22, etc.', category: 'Sensors' },
  { name: 'LiquidCrystal I2C', version: '1.1.2', author: 'Frank de Brabander', description: 'Drive I2C LCD displays.', category: 'Display' },
  { name: 'Adafruit SSD1306', version: '2.5.7', author: 'Adafruit', description: 'Library for monochrome OLEDs.', category: 'Display' },
  { name: 'Servo', version: '1.1.8', author: 'Arduino', description: 'Control servo motors.', category: 'Actuators' },
  { name: 'Adafruit NeoPixel', version: '1.11.0', author: 'Adafruit', description: 'Control WS2811/WS2812B LEDs.', category: 'Actuators' },
  { name: 'MFRC522', version: '1.4.10', author: 'GithubCommunity', description: 'RFID RC522 reader library.', category: 'Communication' },
  { name: 'RTClib', version: '2.1.1', author: 'Adafruit', description: 'Real-time clock library.', category: 'Utility' },
  { name: 'Keypad', version: '3.1.1', author: 'Mark Stanley', description: 'Matrix keypad interface.', category: 'Interface' },
  { name: 'Stepper', version: '1.1.3', author: 'Arduino', description: 'Control stepper motors.', category: 'Actuators' }
];

export const HARDWARE_COMPONENTS: HardwareComponent[] = [
  // --- BOARDS & MCUs (1-15) ---
  { name: 'Arduino UNO R3', type: ComponentType.BOARD, description: 'Mikrokontroler standar industri hobi' },
  { name: 'Arduino Nano V3', type: ComponentType.BOARD, description: 'Versi kompak Uno untuk breadboard' },
  { name: 'Arduino Mega 2560', type: ComponentType.BOARD, description: 'IO ekstra untuk robotika kompleks' },
  { name: 'Arduino Leonardo', type: ComponentType.BOARD, description: 'Mendukung emulasi USB HID (Keyboard/Mouse)' },
  { name: 'Arduino Pro Mini 5V', type: ComponentType.BOARD, description: 'Kecil tanpa chip USB onboard' },
  { name: 'Arduino Pro Mini 3.3V', type: ComponentType.BOARD, description: 'Versi low power untuk sensor 3.3V' },
  { name: 'ESP32 DevKit V1', type: ComponentType.BOARD, description: 'WiFi + Dual Core Bluetooth IoT', libraries: ['WiFi', 'WebServer'] },
  { name: 'ESP8266 NodeMCU LUA', type: ComponentType.BOARD, description: 'WiFi murah meriah untuk Smart Home', libraries: ['ESP8266WiFi'] },
  { name: 'Wemos D1 Mini ESP8266', type: ComponentType.BOARD, description: 'Form factor sangat kecil untuk IoT' },
  { name: 'Raspberry Pi Pico', type: ComponentType.BOARD, description: 'Mikrokontroler performa tinggi RP2040' },
  { name: 'STM32 Blue Pill', type: ComponentType.BOARD, description: 'ARM Cortex-M3 murah dan cepat' },
  { name: 'Teensy 4.0', type: ComponentType.BOARD, description: 'Mikrokontroler super cepat 600MHz' },
  { name: 'ATtiny85 IC', type: ComponentType.BOARD, description: 'Chip 8-pin untuk proyek minimalis' },
  { name: 'Digispark ATtiny85', type: ComponentType.BOARD, description: 'Board USB terkecil di dunia' },
  { name: 'LilyPad Arduino', type: ComponentType.BOARD, description: 'Didesain untuk wearable electronics' },

  // --- INPUT: POTENTIOMETERS & ENCODERS (16-25) ---
  { name: 'Potentiometer 10k Linear', type: ComponentType.INTERFACE, description: 'Resistor variabel putar standar' },
  { name: 'Potentiometer 100k Linear', type: ComponentType.INTERFACE, description: 'Untuk kontrol impedansi tinggi' },
  { name: 'Slide Potentiometer 10k', type: ComponentType.INTERFACE, description: 'Potensiometer geser ala mixer audio' },
  { name: 'Dual Gang Potentiometer', type: ComponentType.INTERFACE, description: 'Kontrol dua channel audio sekaligus' },
  { name: 'Trimmer Pot (Trimpot)', type: ComponentType.INTERFACE, description: 'Potensiometer kecil untuk kalibrasi PCB' },
  { name: 'Rotary Encoder KY-040', type: ComponentType.INTERFACE, description: 'Input putar digital tanpa batas klik' },
  { name: 'Magnetic Encoder', type: ComponentType.SENSOR, description: 'Mendeteksi posisi sudut motor' },
  { name: 'SoftPot Membrane', type: ComponentType.INTERFACE, description: 'Sensor sentuh linear tipis' },
  { name: 'Logarithmic Potentiometer', type: ComponentType.INTERFACE, description: 'Khusus untuk kontrol volume audio' },

  // --- INPUT: SWITCHES & BUTTONS (26-45) ---
  { name: 'Push Button 6x6mm', type: ComponentType.INTERFACE, description: 'Tombol taktil standar' },
  { name: 'Push Button Big 12mm', type: ComponentType.INTERFACE, description: 'Tombol lebih besar dan kokoh' },
  { name: 'Toggle Switch SPDT', type: ComponentType.INTERFACE, description: 'Saklar tuas 2 posisi' },
  { name: 'Toggle Switch DPDT', type: ComponentType.INTERFACE, description: 'Saklar tuas 6 pin (double pole)' },
  { name: 'Slide Switch SS12D00', type: ComponentType.INTERFACE, description: 'Saklar geser kecil' },
  { name: 'Rocker Switch KCD1', type: ComponentType.INTERFACE, description: 'Saklar ON/OFF power standar' },
  { name: 'Limit Switch Micro', type: ComponentType.INTERFACE, description: 'Mendeteksi posisi akhir mekanik' },
  { name: 'DIP Switch 4-Pos', type: ComponentType.INTERFACE, description: 'Saklar setelan konfigurasi biner' },
  { name: 'DIP Switch 8-Pos', type: ComponentType.INTERFACE, description: 'Untuk setting ID/Alamat perangkat' },
  { name: 'Tactile Switch Side-Press', type: ComponentType.INTERFACE, description: 'Tombol tekan dari arah samping' },
  { name: 'Reed Switch', type: ComponentType.SENSOR, description: 'Saklar magnetik (mendeteksi pintu terbuka)' },
  { name: 'Mercury Tilt Switch', type: ComponentType.SENSOR, description: 'Mendeteksi kemiringan dengan raksa' },
  { name: 'Ball Tilt Sensor', type: ComponentType.SENSOR, description: 'Alternatif aman non-raksa untuk kemiringan' },
  { name: 'Emergency Stop Button', type: ComponentType.INTERFACE, description: 'Tombol jamur merah untuk keamanan' },
  { name: 'Arcade Button', type: ComponentType.INTERFACE, description: 'Tombol besar untuk game cabinet' },

  // --- AUDIO & VOICE (46-60) ---
  { name: 'Active Buzzer 5V', type: ComponentType.ACTUATOR, description: 'Suara beep konstan (Hanya perlu HIGH/LOW)' },
  { name: 'Passive Buzzer', type: ComponentType.ACTUATOR, description: 'Bisa memainkan melodi (Perlu sinyal PWM/Tone)' },
  { name: 'Piezo Element Diaphragm', type: ComponentType.ACTUATOR, description: 'Bisa jadi speaker atau sensor ketuk' },
  { name: 'Small Speaker 8 Ohm 0.5W', type: ComponentType.ACTUATOR, description: 'Speaker mini untuk output suara' },
  { name: 'Speaker 4 Ohm 3W', type: ComponentType.ACTUATOR, description: 'Speaker medium untuk musik/suara keras' },
  { name: 'Electret Microphone Modul', type: ComponentType.SENSOR, description: 'Mendeteksi level kebisingan suara' },
  { name: 'MEMS Microphone I2S', type: ComponentType.SENSOR, description: 'Mikrofon digital kualitas tinggi untuk ESP32' },
  { name: 'Voice Recognition Modul V3', type: ComponentType.COMMUNICATION, description: 'Mengenali perintah suara kustom' },
  { name: 'PAM8403 Audio Amp', type: ComponentType.ACTUATOR, description: 'Mini amplifier Class D 2x3W' },
  { name: 'LM386 Audio Amp', type: ComponentType.ACTUATOR, description: 'IC penguat audio low voltage' },
  { name: 'DFPlayer Mini MP3', type: ComponentType.ACTUATOR, description: 'Pemutar lagu dari Micro SD', libraries: ['DFRobotDFPlayerMini'] },
  { name: 'ISD1820 Voice Recorder', type: ComponentType.ACTUATOR, description: 'Modul rekam dan putar suara singkat' },

  // --- POWER & VOLTAGE REGULATORS (61-80) ---
  { name: 'LM2596 Buck Converter', type: ComponentType.ACCESSORY, description: 'Step-down tegangan (Contoh: 12V ke 5V)' },
  { name: 'XL6009 Boost Converter', type: ComponentType.ACCESSORY, description: 'Step-up tegangan (Contoh: 3.7V ke 12V)' },
  { name: 'MT3608 Mini Boost', type: ComponentType.ACCESSORY, description: 'Step-up kecil efisiensi tinggi' },
  { name: 'TP4056 Li-Ion Charger', type: ComponentType.ACCESSORY, description: 'Charger baterai 3.7V via Micro/Type-C' },
  { name: 'AMS1117 3.3V Regulator', type: ComponentType.ACCESSORY, description: 'Menurunkan tegangan ke 3.3V stabil' },
  { name: 'Voltage Regulator 7805', type: ComponentType.ACCESSORY, description: 'Regulator linear output 5V tetap' },
  { name: 'Voltage Regulator 7812', type: ComponentType.ACCESSORY, description: 'Regulator linear output 12V tetap' },
  { name: 'Solar Cell 5V 1W', type: ComponentType.ACCESSORY, description: 'Panel surya mini untuk charging' },
  { name: 'Solar Cell 12V 5W', type: ComponentType.ACCESSORY, description: 'Panel surya untuk sistem IoT outdoor' },
  { name: 'MB102 Breadboard Power', type: ComponentType.ACCESSORY, description: 'Supply 3.3V/5V langsung ke breadboard' },
  { name: '18650 Battery Holder', type: ComponentType.ACCESSORY, description: 'Dudukan baterai Li-ion standar' },
  { name: '9V Battery Snap', type: ComponentType.ACCESSORY, description: 'Kabel konektor baterai kotak' },
  { name: 'DC Barrel Jack Female', type: ComponentType.ACCESSORY, description: 'Input power dari adaptor dinding' },
  { name: 'Logic Level Shifter 4-CH', type: ComponentType.ACCESSORY, description: 'Konversi sinyal 5V ke 3.3V aman' },

  // --- COMMUNICATION & ANTENNAS (81-100) ---
  { name: 'HC-05 Bluetooth Serial', type: ComponentType.COMMUNICATION, description: 'Modul Bluetooth 2.0 Klasik' },
  { name: 'JDY-31 Bluetooth SPP', type: ComponentType.COMMUNICATION, description: 'Bluetooth murah pengganti HC-05' },
  { name: 'HM-10 BLE 4.0', type: ComponentType.COMMUNICATION, description: 'Bluetooth Low Energy untuk iPhone/Android' },
  { name: 'NRF24L01+ Transceiver', type: ComponentType.COMMUNICATION, description: 'Komunikasi wireless 2.4GHz antar Arduino' },
  { name: 'NRF24L01+ PA/LNA', type: ComponentType.COMMUNICATION, description: 'Versi long range dengan antena eksternal' },
  { name: 'LoRa SX1278 433MHz', type: ComponentType.COMMUNICATION, description: 'Komunikasi jarak sangat jauh (Km)' },
  { name: 'GPS Neo-6M Modul', type: ComponentType.COMMUNICATION, description: 'Pelacakan lokasi satelit', libraries: ['TinyGPSPlus'] },
  { name: 'SIM800L GSM Modul', type: ComponentType.COMMUNICATION, description: 'Bisa SMS, Telepon, dan Internet GPRS' },
  { name: 'SIM900A GPRS Shield', type: ComponentType.COMMUNICATION, description: 'GSM Shield yang mudah dipasang ke Uno' },
  { name: 'Antena 2.4GHz SMA', type: ComponentType.ACCESSORY, description: 'Antena eksternal untuk WiFi/Bluetooth' },
  { name: 'Antena LoRa Spring', type: ComponentType.ACCESSORY, description: 'Antena pegas internal untuk LoRa' },
  { name: 'Antena GPS Keramik', type: ComponentType.ACCESSORY, description: 'Antena patch standar untuk GPS' },
  { name: 'W5100 Ethernet Shield', type: ComponentType.COMMUNICATION, description: 'Menambah port LAN ke Arduino Uno' },
  { name: 'ENC28J60 Ethernet', type: ComponentType.COMMUNICATION, description: 'Modul internet via kabel yang murah' },

  // --- SENSORS: ENVIRONMENT & GAS (101-125) ---
  { name: 'DHT11 Temp/Humi', type: ComponentType.SENSOR, description: 'Sensor suhu & kelembaban dasar' },
  { name: 'DHT22 AM2302', type: ComponentType.SENSOR, description: 'Versi akurat untuk suhu/kelembaban' },
  { name: 'DS18B20 Waterproof', type: ComponentType.SENSOR, description: 'Sensor suhu kabel tahan air (Liquid)' },
  { name: 'BMP280 Barometric', type: ComponentType.SENSOR, description: 'Tekanan udara & Ketinggian (Altimeter)' },
  { name: 'BME280', type: ComponentType.SENSOR, description: 'Suhu, Kelembaban, Tekanan (All-in-one)' },
  { name: 'MQ-2 Smoke/Combustible', type: ComponentType.SENSOR, description: 'Sensor asap dan gas bocor' },
  { name: 'MQ-135 Air Quality', type: ComponentType.SENSOR, description: 'Mendeteksi CO2, Benzene, Amonia' },
  { name: 'MQ-7 Carbon Monoxide', type: ComponentType.SENSOR, description: 'Khusus deteksi gas CO beracun' },
  { name: 'MQ-3 Alcohol Sensor', type: ComponentType.SENSOR, description: 'Alat tes napas alkohol' },
  { name: 'MQ-4 Methane Gas', type: ComponentType.SENSOR, description: 'Deteksi gas alam/metana' },
  { name: 'Rain Drop Sensor', type: ComponentType.SENSOR, description: 'Mendeteksi cuaca hujan' },
  { name: 'Soil Moisture Capacitive', type: ComponentType.SENSOR, description: 'Sensor tanah tahan karat' },
  { name: 'Soil Moisture Resistive', type: ComponentType.SENSOR, description: 'Sensor kelembaban tanah standar' },
  { name: 'Water Level Depth', type: ComponentType.SENSOR, description: 'Mendeteksi ketinggian air di tangki' },
  { name: 'Turbidity Sensor', type: ComponentType.SENSOR, description: 'Mendeteksi kekeruhan air' },
  { name: 'pH Sensor Modul', type: ComponentType.SENSOR, description: 'Mendeteksi tingkat asam-basa cairan' },
  { name: 'TDS Sensor Meter', type: ComponentType.SENSOR, description: 'Mendeteksi jumlah partikel terlarut di air' },
  { name: 'Oksigen Sensor O2', type: ComponentType.SENSOR, description: 'Mendeteksi kadar oksigen di udara' },

  // --- SENSORS: LIGHT & OPTICAL (126-140) ---
  { name: 'LDR Photoresistor', type: ComponentType.SENSOR, description: 'Sensor intensitas cahaya (Resistif)' },
  { name: 'BH1750 Digital Lux', type: ComponentType.SENSOR, description: 'Mengukur cahaya dalam satuan LUX akurat' },
  { name: 'TSL2561 Luminosity', type: ComponentType.SENSOR, description: 'Sensor cahaya I2C range luas' },
  { name: 'UV Sensor GUVA-S12SD', type: ComponentType.SENSOR, description: 'Mengukur indeks sinar UV matahari' },
  { name: 'IR Receiver 1838', type: ComponentType.SENSOR, description: 'Menerima sinyal remote TV/AC' },
  { name: 'IR Transmitter LED', type: ComponentType.ACTUATOR, description: 'Mengirim sinyal remote control' },
  { name: 'TCS3200 Color Sensor', type: ComponentType.SENSOR, description: 'Mendeteksi warna benda di depannya' },
  { name: 'Optical Dust Sensor', type: ComponentType.SENSOR, description: 'Mendeteksi partikel debu PM2.5' },

  // --- DISCRETE COMPONENTS (141-170) ---
  { name: 'Resistor 220 Ohm', type: ComponentType.ACCESSORY, description: 'Resistor standar untuk LED' },
  { name: 'Resistor 1k Ohm', type: ComponentType.ACCESSORY, description: 'Resistor pull-up/pembatas arus' },
  { name: 'Resistor 10k Ohm', type: ComponentType.ACCESSORY, description: 'Standar pull-up sensor/tombol' },
  { name: 'Capacitor Ceramic 100nF', type: ComponentType.ACCESSORY, description: 'Kapasitor decoupling noise' },
  { name: 'Capacitor Electrolytic 100uF', type: ComponentType.ACCESSORY, description: 'Stabilisator tegangan power' },
  { name: 'Capacitor Electrolytic 1000uF', type: ComponentType.ACCESSORY, description: 'Filter power supply besar' },
  { name: 'Diode 1N4007', type: ComponentType.ACCESSORY, description: 'Penyearah dan proteksi arus balik' },
  { name: 'Zener Diode 5.1V', type: ComponentType.ACCESSORY, description: 'Pembatas tegangan ke 5.1V' },
  { name: 'Schottky Diode SS14', type: ComponentType.ACCESSORY, description: 'Dioda drop tegangan rendah cepat' },
  { name: 'Transistor NPN BC547', type: ComponentType.ACCESSORY, description: 'Switching sinyal kecil / Penguat' },
  { name: 'Transistor PNP BC557', type: ComponentType.ACCESSORY, description: 'Switching polaritas negatif' },
  { name: 'N-Channel MOSFET IRFZ44N', type: ComponentType.ACCESSORY, description: 'Switching beban arus besar (DC Motor/LED Strip)' },
  { name: 'P-Channel MOSFET IRF9540', type: ComponentType.ACCESSORY, description: 'Switching jalur positif arus besar' },
  { name: 'Optocoupler PC817', type: ComponentType.ACCESSORY, description: 'Isolasi sinyal antar sirkuit aman' },
  { name: 'IC 555 Timer', type: ComponentType.ACCESSORY, description: 'Pembangkit pulsa / Delay analog' },
  { name: 'IC 74HC595 Shift Register', type: ComponentType.ACCESSORY, description: 'Menambah output digital Arduino' },
  { name: 'Bridge Rectifier', type: ComponentType.ACCESSORY, description: 'Penyearah gelombang penuh AC ke DC' }
];

export const BATTERY_OPTIONS = [
  { label: 'USB (5V)', value: 'USB 5V' },
  { label: '9V (Alkaline)', value: '9V' },
  { label: '12V (Lead Acid)', value: '12V' },
  { label: '3.7V (Li-ion)', value: '3.7V' },
  { label: 'Adaptor 12V 2A', value: 'DC Adaptor 12V' }
];

export const EXAMPLE_PROJECTS: Omit<ArduinoProject, 'id' | 'createdAt'>[] = [
  {
    name: "01. Blink Dasar",
    description: "Langkah pertama: Menyalakan dan mematikan LED internal pada Pin 13.",
    code: `void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`,
    libraries: [],
    wiring: "| Komponen | Pin Arduino | Keterangan |\n|---|---|---|\n| LED Built-in | 13 | Langsung di Board |\n| GND | GND | Ground |",
    controls: [{ id: 'ex1', pin: 13, label: 'LED Built-in', type: 'digital', lastState: false }],
    batteryType: 'USB 5V'
  },
  {
    name: "02. Lampu Lalu Lintas",
    description: "Simulasi lampu lalu lintas sederhana dengan 3 LED (Merah, Kuning, Hijau).",
    code: `const int red = 12, yellow = 11, green = 10;\n\nvoid setup() {\n  pinMode(red, OUTPUT); pinMode(yellow, OUTPUT); pinMode(green, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(red, HIGH); delay(3000); digitalWrite(red, LOW);\n  digitalWrite(yellow, HIGH); delay(1000); digitalWrite(yellow, LOW);\n  digitalWrite(green, HIGH); delay(3000); digitalWrite(green, LOW);\n}`,
    libraries: [],
    wiring: "Merah: Pin 12, Kuning: Pin 11, Hijau: Pin 10. Hubungkan melalui resistor 220 Ohm ke GND.",
    controls: [
      { id: 'ex2r', pin: 12, label: 'Lampu Merah', type: 'digital', lastState: false },
      { id: 'ex2y', pin: 11, label: 'Lampu Kuning', type: 'digital', lastState: false },
      { id: 'ex2g', pin: 10, label: 'Lampu Hijau', type: 'digital', lastState: false }
    ],
    batteryType: 'USB 5V'
  },
  {
    name: "03. Monitoring Suhu LCD",
    description: "Membaca sensor DHT11 dan menampilkan hasilnya di layar LCD I2C.",
    code: `#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n#include <DHT.h>\n\nDHT dht(2, DHT11);\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nvoid setup() {\n  dht.begin(); lcd.init(); lcd.backlight();\n}\n\nvoid loop() {\n  float h = dht.readHumidity();\n  float t = dht.readTemperature();\n  lcd.setCursor(0,0); lcd.print("Suhu: "); lcd.print(t); lcd.print("C");\n  lcd.setCursor(0,1); lcd.print("Lembap: "); lcd.print(h); lcd.print("%");\n  delay(2000);\n}`,
    libraries: ["DHT sensor library", "LiquidCrystal I2C", "Wire"],
    wiring: "VCC ke 5V, GND ke GND. DHT Data ke Pin 2. LCD SDA ke A4, SCL ke A5.",
    controls: [{ id: 'ex3', pin: 2, label: 'DHT Sensor', type: 'input', lastState: false }],
    batteryType: 'USB 5V'
  }
];

export const SYSTEM_PROMPT = `
You are the ALTOino AI, an expert Arduino Electronics Engineer.

MANDATORY RESPONSE FORMAT:
You must respond with a JSON object containing:
- "code": Full, valid .ino code.
- "explanation": Brief technical explanation.
- "libraries": Array of string library names to include.
- "wiringInstructions": Markdown table or list for wiring.

TECHNICAL RULES:
1. Always use #include for requested libraries.
2. Ensure pin definitions match standard practices.
3. If specific hardware is mentioned, prioritize its specific libraries.
4. Output JSON ONLY. No markdown outside the JSON.
`;
