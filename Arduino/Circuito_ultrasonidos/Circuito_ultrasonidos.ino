//Configuración sensor ultrasonico buton "si"
int trigYes = 11;
int ecoYes = 10;

//Configuración sensor ultrasonico buton "no"
int trigNo = 4;
int ecoNo = 2;

//Configuración sensor ultrasonico buton "jump"
int trigJump = 9;
int ecoJump = 6;

//Variables  para determinar la distancia
int duracionYes;
int duracionNo;
int duracionJump;

int distanciaYes;
int distanciaNo;
int distanciaJump;




void setup() {
  //sensor ultrasonico boton "si"
  pinMode(trigYes, OUTPUT);
  pinMode(ecoYes, INPUT);

  //sensor ultrasonico boton "no"
  pinMode(trigNo, OUTPUT);
  pinMode(ecoNo, INPUT);

  //sensor ultrasonico boton "jump"
  pinMode(trigJump, OUTPUT);
  pinMode(ecoJump, INPUT);

  
  //pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {

  //Configuracion para medir la distancia del sensor "si"
  digitalWrite(trigYes, HIGH);
  delay(1);
  digitalWrite(trigYes, LOW);
  
  duracionYes = pulseIn(ecoYes, HIGH);
  distanciaYes = duracionYes / 58.2;
  Serial.print(distanciaYes);
  delay(300);

  //--------------------------------------------------------------------------------------------------
  //Configuracion para medir la distancia del sensor "no"
  digitalWrite(trigNo, HIGH);
  delay(1);
  digitalWrite(trigNo, LOW);
  
  duracionNo = pulseIn(ecoNo, HIGH);
  distanciaNo = duracionNo / 58.2;
  Serial.print(' ');
  Serial.print(distanciaNo);
  delay(300);

  //--------------------------------------------------------------------------------------------------
  //Configuracion para medir la distancia del sensor "jump"
  digitalWrite(trigJump, HIGH);
  delay(1);
  digitalWrite(trigJump, LOW);
  
  duracionJump = pulseIn(ecoJump, HIGH);
  distanciaJump = duracionJump / 58.2;
  Serial.print(' ');
  Serial.print(distanciaJump);
  Serial.println(' ');
  delay(500);

  /*if (DISTANCIA <=200 && DISTANCIA >= 0){
    digitalWrite(LED, HIGH);
      delay(DISTANCIA * 10);
      digitalWrite(LED, LOW);
  } */
}
