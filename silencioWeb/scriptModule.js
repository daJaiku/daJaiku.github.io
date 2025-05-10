import data from "./data.json" with { type: "json" };

var numButtons = data.length;
var soundArray = new Array(numButtons);
var toggleArray = new Array(numButtons);

export function init()
{
        for (var i = 0; i < numButtons; i++)
        {
                toggleArray[i] = false
                soundArray[i] = new Audio(data[i].sonido);
                createButton(i);
        }
}

function createButton(id)
{
        var botonera = document.getElementById("botonera"); 

        var boton = document.createElement("div");
        boton.setAttribute("onclick", "changeState("+id+")");
        boton.className = "boton";
        boton.id = "boton"+id;
        botonera.appendChild(boton);

        var imagen = document.createElement("img");
        imagen.src = data[id].imagen;
        imagen.className = "imagen";
        boton.appendChild(imagen);

        var texto = document.createElement("div");
        texto.innerHTML = data[id].nombre;
        texto.className = "texto";
        boton.appendChild(texto);
}

export function changeState(buttonId)
{
        toggleArray[buttonId] = !toggleArray[buttonId];

        document.getElementById("boton"+buttonId).style.backgroundColor = (toggleArray[buttonId]?"#ccc":"#555");
        document.getElementById("boton"+buttonId).style.color = (toggleArray[buttonId]?"#555":"#ccc");

        if (toggleArray[buttonId]) startTimer(buttonId);
}

function startTimer(buttonId)
{
    var timerFunction = function()
    {
        if (!toggleArray[buttonId]) return;
        soundArray[buttonId].play();
        clearInterval(timer);

        var randomTime = Math.floor(Math.random() * 1000000);
        timer = setInterval(timerFunction, randomTime);
    };

    var timer = setInterval(timerFunction, 0);
}
