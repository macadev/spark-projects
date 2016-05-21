/*

  templight.ino

  Adjusts the color of an RGB LED to changes in temperature with tempHigh (Celcius) being full red and tempLow (Celcius) being full blue.
  Also uses a push-button for on/off functionality.

  Written for the Spark Core

*/

// LED leads connected to PWM pins
const int RED_LED_PIN = A4;
const int GREEN_LED_PIN = A1;
const int BLUE_LED_PIN = A0;
int temperaturePin = A7; //temperature sensor pin
int inputPin = D1; //push-button pin
int val = 0; //variable for push-button status
int state = 1; //variable for on/off state of the LED
int tempHigh = 25; //top value in range of temperature values (mess with me!)
int tempLow = 20; //bottom value in range of temperature values (mess with me!) --make sure tempHigh stays above tempLow
// and the current temperature is within the range for optimum performance.




// Used to store the intensity level of the individual LEDs, intitialized to full brightness (0)
int redIntensity = 0;
int greenIntensity = 0;
int blueIntensity = 0;


void setup() {
    //set LED pins to outputs

    pinMode(RED_LED_PIN, OUTPUT);
    pinMode(GREEN_LED_PIN, OUTPUT);
    pinMode(BLUE_LED_PIN, OUTPUT);

    //set temperature and push-button pins as inputs
    pinMode(temperaturePin, INPUT);
    pinMode(inputPin, INPUT);

    //open serial connection for debugging
    Serial.begin(9600);
}

void loop() {
    val = digitalRead(inputPin); //read the state of the push-button
    double temperature = (analogRead(temperaturePin) * 3.3) / 4095;  //getting the voltage reading from the temperature sensor
    temperature = (temperature - 0.5) * 100; //turn the voltage into a Celcius reading
    Serial.println(temperature); //print temperature to serial for debugging
    int adjRed = (int) (255 - redVal(temperature)); // turn temperature into integer adjusted red value (0 is full red, 255 is min)
    int adjBlue = (int) (255 - blueVal(temperature)); // turn temperature into integer adjusted blue value (0 is full blue, 255 is min)

    if (val == LOW) { //if push-button pressed
        state = !state; //reverse on/off state
        delay(250); //primitive button debounce

    }

    if (!state) { //if light-state off, set Red and Blue vals to minimum (255)
        adjRed = 255;
        adjBlue = 255;
    }


    analogWrite(GREEN_LED_PIN, 255);  //set GREEN LED value to minimum

    //write red and blue values to respective pins
    analogWrite(BLUE_LED_PIN, adjBlue);
    analogWrite(RED_LED_PIN, adjRed);

    //print red and blue adjusted values alongside light state (on/off as 1/0)
    //Serial.println("red: " + String(adjRed));
    //Serial.println("blue: " + String(adjBlue));
    //Serial.println(state);

}

 /*
 redVal is a function that adjusts a celcius reading into a red value from 0 to 255. 38 corresponds to 255 while -26 corresponds to 0.
 */

double redVal(double temp){
    if (temp >= tempHigh){ //return red as max as temp at 38 or higher
        return 255;
    } else if (temp <= tempLow){ //return red as min as temp at -26 or lower
        return 0;
    }
    double mulFactor = (256/(tempHigh - tempLow)); //How many times the range of temps goes into 256
    double retVal = mulFactor*(temp - tempLow); //multiply the mulFactor by [temperature - (tempLow)] (to align range) to get adjusted color intensity.
    if (retVal > 0){ //adjust as 255 max-val, not 256
        retVal = retVal - 1;
    }

    return retVal;
}

/*
 blueVal is a function that adjusts a celcius reading into a blue value from 0 to 255. 38 corresponds to 255 while -26 corresponds to 0.
 */
double blueVal(double temp){

    double retVal = redVal(temp); //find temperature adjusted red value
    retVal = 255 - retVal; //invert the red value to find the blue value
    return retVal;
}
