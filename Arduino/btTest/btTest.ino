//la lib qui permet de faire du serie sur des ports classiques
#include <SoftwareSerial.h>
//les ports que l'on va utiliser pour la connexion serie entre l'arduino et le module BT
SoftwareSerial mySerial(4, 2); // RX, TX

//variable qui recevra les commande du module BT
String command = ""; 
//le pin de la led
int led = 13;
//un bool qui dit si on est en mode blink ou pas
boolean bl=false;

void setup() {
  //on init le serial pour afficher le debug
  Serial.begin(9600);
  
  //on init le softserial pour la connexion avec le modul bt
  mySerial.begin(9600);

  //on dit qu'on utilise le pin 13 en sortie
  pinMode(led, OUTPUT);
  
}

void loop() {

  //on lit sur le port soft serie si il y a qq chose
  if (mySerial.available()) {
    while(mySerial.available()) { // tant qu'il y en a, on lit
      command += (char)mySerial.read();
    }
    

    //on affiche la commande recu sur le serie pour debug
    Serial.println(command);

    //si c'est la commande blink, on met le boola true
    if (command=="blink")
    {
      if (bl==false)
      {
        bl=true;
        
      }
      else
      {
	//sinon on eteind la led et on met le bool a false
        digitalWrite(led, LOW); 
        bl=false;
        
      }
    }
      
    command = ""; 
  }
  //donc si le bool est a true on blinke :)
  if (bl==true)
  {
    digitalWrite(led, HIGH);
    delay(1000);           
    digitalWrite(led, LOW);
    delay(1000);
  }
}
