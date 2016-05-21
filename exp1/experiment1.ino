int inputPin = D1;       //push-button pin
int ledPin = D0;
int buttonState = HIGH;       //variable for push-button status
int state = HIGH;     //initially set to ON

void setup() {
    //set LED pins to outputs
    pinMode(inputPin, INPUT);
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, HIGH);
}

void loop() {

    buttonState = digitalRead(inputPin); //read the state of the push-button

    //if push-button pressed
    if (buttonState == LOW) {
        if (state == HIGH) {
            digitalWrite(ledPin, LOW);
            delay(250); //primitive button debounce
            state = LOW;
        } else {
            digitalWrite(ledPin, HIGH);
            delay(250); //primitive button debounce
            state = HIGH;
        }
    }
}
