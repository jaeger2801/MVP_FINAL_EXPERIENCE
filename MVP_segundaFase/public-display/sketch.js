//const { redirect } = require("express/lib/response");

//const { text } = require("express"); <--- dejo esto comentado, siempre que se crea un texto se crea esto que daña el código

let socket = io();
let pantalla;
let contadorSkipping;

//variable para la implementación de una barra de carga
let ancho;
let timer;

//Carga de interfaces/imagenes
let presentacionProducto; //pantalla 0
let presentacionExperiencia; //pantalla 1
let instruciones; //pantalla 2
let indicativoTapete; //pantalla 3
let indicativoPreparación; //pantalla 4
let juego; //pantalla 5
let feedback; //pantalla 6
let agradecimiento; //pantalla 7

//carga de sonidos
let siguientePantalla;
let anteriorPantalla;
let ejercicioFeedback;

//Variables del participante
let participantEndpoint = "http://localhost:5050/participant";
let participant = {
  lead: false,
  date: "",
  name: "",
  email: "",
  start: "",
  location: "Unicentro",
  timestamp: "",
  like: "",
};
let startTime = 0;
let startInteraction = 0;
let endInteraction = 0;
let date;
let [month, day, year] = [];
let [hour, minutes, seconds] = [];
let userInput;
let sizeButton = 60;
let hasStart = false;

function setup() {
  frameRate(60);
  createCanvas(1920, 1080);

  pantalla = 0;
  contadorSkipping = 0;
  ancho = 100;
  ancho2 = 400;
  timer = 5;
}

function preload() {
  //carga de imagenes
  presentacionProducto = loadImage(
    "data/Presentación producto (pantalla 0).png"
  );
  presentacionExperiencia = loadImage(
    "data/Presentación Experiencia (pantalla 1).png"
  );
  instruciones = loadImage("data/Instrucciones.gif");
  indicativoTapete = loadImage(
    "data/Indicativo persona frente sensor (pantalla 3).png"
  );
  indicativoPreparación = loadImage("data/Conteo pre juego (pantalla 4).png");
  juego = loadImage("data/Juego (compressed).gif");
  feedback = loadImage("data/Feedback (pantalla 6).png");
  agradecimiento = loadImage("data/Agradecimiento escanea QR (pantalla 7).png");


  soundFormats("mp3", "wav");
  siguientePantalla = loadSound("dataSounds/continuar_1.wav");
  anteriorPantalla = loadSound("dataSounds/Regresar_1.wav");
  ejercicioFeedback = loadSound("dataSounds/Feedback_1.wav");
}

function draw() {
  background(255, 164, 162);

  switch (pantalla) {
    //Pantalla presentación producto y experiencia 1
    //---------------------------------------------------------------------------------------------------------

    case 0:
      image(presentacionProducto, 0, 0);
      /* fill(255, 164, 162);
            rect(0, 0, 1920, 1080); */

      fill(255);
      textSize(50);
      //text('Pantalla para presentación producto y experiencia 1', 50, 100);
      break;

    //Pantalla presentación producto y experiencia 2
    //---------------------------------------------------------------------------------------------------------
    case 1:
      image(presentacionExperiencia, 0, 0);

      break;

    case 2:
      //Pantalla para dar las Instrucciones del juego
      //---------------------------------------------------------------------------------------------------------

      image(instruciones, 0, 0);

      /*text('Pantalla para la presentación de las instruciones', 50, 100) */
      break;

    case 3:
      //Pantalla para indicar que la persona se pare en el tapete
      //---------------------------------------------------------------------------------------------------------

      //función de socket que solo funciona en esta pantalla para la verificación de que la persona está en el tapete
      socket.on("verifica", () => {
        pantalla = 4;
      });

      image(indicativoTapete, 0, 0);

      break;

    case 4:
      //Pantalla para indicar que la persona está parada en el tapete
      //---------------------------------------------------------------------------------------------------------
      image(indicativoPreparación, 0, 0);

      //barra de carga
      fill(36, 129, 142);
      textSize(150);
      text(timer, 1920 / 2 - 35, 1080 / 2 + 80);

      if (frameCount % 40 == 0) {
        ancho -= 20;

        if (ancho <= 80) {
          timer = 4;
        }

        /* if(timer == 4){
                    ejercicioFeedback.play();
                } */

        if (ancho <= 60) {
          timer = 3;
        }

        if (ancho <= 40) {
          timer = 2;
        }

        if (ancho <= 20) {
          timer = 1;
        }

        if (ancho <= 0) {
          pantalla = 5;
        }
      }
      break;

    case 5:
      //pantalla donde se ejecuta el juego
      //--------------------------------------------------------------------------------------
      if ((pantalla = 5)) {
        socket.off("verifica");
      }

      image(juego, 0, 0);

      //texto que registra el skipping del jugador
      fill(235, 144, 45);
      noStroke();
      textSize(60);
      text("Puntaje", 150, 1080 / 2 - 160);

      fill(36, 129, 142);
      noStroke();
      textSize(100);
      text(contadorSkipping, 150, 1080 / 2 -55);

      //texto indicativo de tiempo
      fill(235, 144, 45);
      noStroke();
      textSize(60);
      text("Tiempo", 150, 1080 / 2 +20);

      //barra de carga solid
      fill(167, 60, 153);
      noStroke();
      rect(150, 1080 / 2 + 50, ancho2, 50, 50);

      //barra de carga stroke
      noFill();
      stroke(167, 60, 153);
      strokeWeight(5);
      rect(150, 1080 / 2 + 50, 400, 50, 50);

      //framecount para el tiempo de carga
      if (frameCount % 33 == 0) {
        ancho2 -= 14;
      }

      if (ancho2 <= 0) {
        pantalla = 6;
      }

      break;

    case 6:
      //pantalla donde se dan los resultados
      //--------------------------------------------------------------------------------------

      image(feedback, 0, 0);

      //calorias quemadas
      //1 repetición haciendo skiping representa 0.29 cal quemadas
      fill(235, 144, 45);
      noStroke();
      textSize(40);
      text(contadorSkipping * 2, 460, 490 + 10);
      text("Calorías quemadas", 530, 490 + 10);

      //metros recorridos,
      //en cada repetición se recorren 120 cm, aqui se hace la conversión a metros con base a las repeticiones
      fill(235, 144, 45);
      noStroke();
      textSize(40);
      text((contadorSkipping * 120) / 100, 460, 634 + 20);
      text("Métros recorridos", 530, 634 + 20);

      //pasos dados
      //14 pasos por repetición aproximadamente
      fill(235, 144, 45);
      noStroke();
      textSize(40);
      text(contadorSkipping * 14, 460, 795 + 20);
      text("Pasos realizados", 530, 795 + 20);

      break;

    case 7:
      //pantalla donde se muestra el codigo QR
      //--------------------------------------------------------------------------------------
      image(agradecimiento, 0, 0);

      break;
  }
  //console.log(contadorSkipping);
}

socket.on("cambio", (pantallaC) => {
  switch (pantallaC) {
    case "sumar":
      
      if (pantalla === 0) {
        console.log("start interaction");
        date = new Date();
        [month, day, year] = [
          date.getMonth() + 1,
          date.getDate(),
          date.getFullYear(),
        ];
        [hour, minutes, seconds] = [
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ];
        startTime = `${hour}:${minutes}:${seconds}`;
        startInteraction = Date.now();
        hasStart = true;
      }

      if (pantalla < 3 || pantalla > 5) {
        pantalla += 1;
        siguientePantalla.play();
      }
      break;

    case "restar":
      if (pantalla > 1 || pantalla < 2 || pantalla > 5) {
        pantalla -= 1;
        anteriorPantalla.play();
      }
      break;
  }
  console.log(pantallaC);
});

//función de socket que tiene como función contar la cantidad de repeticiones que hace el jugador

socket.on("skipping", () => {
  if (pantalla == 5) {
    contadorSkipping += 1;
  }
});

socket.on("cambioRegistro", (cambioAlRegistro) => {
  pantalla = 0;
  gatherParticipantData(cambioAlRegistro);
  sendParticipant(participant);
});


function gatherParticipantData(p) {
  console.log(participant.name);
  console.log(participant.email);
  endInteraction = Math.floor((Date.now() - startInteraction) / 1000);
  hasStart = false;
  if (p != undefined) {
    participant = {
      lead: true,
      date: `${month}/${day}/${year}`,
      name: p.name,
      email: p.email,
      start: startTime,
      location: "Universidad Icesi",
      timestamp: endInteraction,
      like: 'Like',
    };
  } else {
    participant = {
      lead: false,
      date: `${month}/${day}/${year}`,
      name: "",
      email: "",
      start: startTime,
      location: "Universidad Icesi",
      timestamp: endInteraction,
      like: 'No like',
    };
  }
}

async function sendParticipant(participant) {
  let bodyJSON = JSON.stringify(participant);
  const postRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyJSON,
  };
  const request = await fetch(participantEndpoint, postRequest);
}
