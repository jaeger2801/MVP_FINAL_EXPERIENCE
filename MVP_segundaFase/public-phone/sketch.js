let socket = io();

//aqui se van a crear los inputs
let nameInput;
let emailInput;

//Declaración de pantallas
let pantalla;

//declaración de imagenes
let formulario;
let agradecimiento;

//variables firebase
let emailSave;
let nameSave;

let likeB = Boolean;

function preload() {
  formulario = loadImage("data/formulario.png");
  agradecimiento = loadImage("data/Gracias.png");

  like = loadImage("data/Frame 1.png");
}

function setup() {
  pantalla = 0;

  nameInput = createInput("");
  emailInput = createInput("");

  canvas = createCanvas(414, 896);

  nameInput.input(myInputEventName);
  emailInput.input(myInputEventEmail);
}

function draw() {
  background(414, 896);

  switch (pantalla) {
    case 0:
      //rectangulo del boton "enviar"
      fill(241, 179, 60);
      noStroke();
      rect(104, 655, 206, 49, 17);

      //rectangulo del texto
      fill(241, 179, 60);
      noStroke();
      rect(52, 813, 309, 19);

      image(formulario, 0, 0);

      //Ingresa el nombre
      nameInput.position(48, 381);
      nameInput.size(319, 27);
      nameInput.show();

      //Ingresa el correo
      emailInput.position(48, 460);
      emailInput.size(319, 27);
      emailInput.show();

      if(likeB==true){
          image(like,187,562);
      }
      break;

    case 1:
      image(agradecimiento, 0, 0);

      nameInput.hide();
      emailInput.hide();

      break;
  }
}

function myInputEventName() {
  nameSave = this.value();
}
function myInputEventEmail() {
  emailSave = this.value();
}

function mouseClicked() {
  switch (pantalla) {
    case 0:
      //botón enviar
      //rect(104, 655, 206, 49, 17);
      if (mouseX > 104 && mouseX < 310 && mouseY > 655 && mouseY < 704) {
        pantalla = 1;
        socket.emit("cambioRegistro", { name: nameSave, email: emailSave });
      }

      //botón like
      //rect(104, 655, 206, 49, 17);
      
      if (mouseX > 200 && mouseX < 220 && mouseY > 570 && mouseY < 590){
      //(dist(207,580)<25) {
        likeB = true;
        socket.emit("like");
      }
      //botón saltar
      //rect(52, 813, 309, 19);
      if (mouseX > 52 && mouseX < 361 && mouseY > 813 && mouseY < 832) {
        pantalla = 1;
        socket.emit("cambioRegistro");
      }

      break;
  }
}
