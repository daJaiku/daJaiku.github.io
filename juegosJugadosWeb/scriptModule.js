import data from "./data.json" with { type: "json" };

let debug = false;


let sortedBy = "default";
let defaultYear = 0;

let pin;
let añoPin;

getVersion();

export function init()
{
    añoPin = 0;
    pin = 0;

    const container = document.getElementById("container");

    for (let i=0; i < data.length; i++)
    {
        //creación de etiquetas según el tipo de ordenamiento
        switch (sortedBy)
        {
            case "year":
            {
                if (data[i].año != defaultYear)
                {
                    //añadir separador de año
                    const yearSeparator = document.createElement("div");
                    const br = document.createElement("br");
                    const br2 = document.createElement("br");

                    yearSeparator.id = "yearSeparator";
                    yearSeparator.textContent = data[i].año;

                    container.appendChild(br);
                    container.appendChild(yearSeparator);
                    container.appendChild(br2);

                    defaultYear = data[i].año;
                }
                break;
            }
            case "alphabetical":
            {
                if (data[i].nombre.charAt(0).toUpperCase() != defaultYear)
                {
                    //añadir separador de año
                    const yearSeparator = document.createElement("div");
                    const br = document.createElement("br");
                    const br2 = document.createElement("br");

                    yearSeparator.id = "yearSeparator";
                    yearSeparator.textContent = data[i].nombre.charAt(0).toUpperCase();

                    container.appendChild(br);
                    container.appendChild(yearSeparator);
                    container.appendChild(br2);

                    defaultYear = data[i].nombre.charAt(0).toUpperCase();
                }
                break;
            }
            default:
            {
                if (data[i].añoJugado != defaultYear)
                {
                    //añadir separador de año
                    const yearSeparator = document.createElement("div");
                    const br = document.createElement("br");
                    const br2 = document.createElement("br");

                    yearSeparator.id = "yearSeparator";
                    yearSeparator.textContent = "Jugado en " + data[i].añoJugado;

                    container.appendChild(br);
                    container.appendChild(yearSeparator);
                    container.appendChild(br2);

                    defaultYear = data[i].añoJugado;
                }
                break;
            }
        }



        //tarjeta de cada juego (identificado con el año en el que se ha jugado)
        const card = document.createElement("div");
        card.id = "card";
        card.className = data[i].añoJugado;

        //imagen de fondo (si tiene)
        const bg = document.createElement("div");
        bg.id = "backgroundImage";
        if (data[i].imagenFondo) 
            bg.style.backgroundImage = `url("${data[i].imagenFondo}")`;

        //imagen del juego (carátula)
        const image = document.createElement("img");
        image.id = "image";
        image.src = data[i].imagen;

        //contenedor donde se encuentra todo el texto
        const textContainer = document.createElement("div");
        textContainer.id = "textContainer";

        //contenedor del título y la desarrolladora
        const titleContainer = document.createElement("div");
        titleContainer.id = "titleContainer";

        //título (incluye la fecha de lanzamiento)
        const title = document.createElement("div");
        title.id = "title";

        if (debug)
        {
            if (data[i].añoJugado != añoPin)
            {
            pin = data[i].id - 1;
            añoPin = data[i].añoJugado;
            }
            title.textContent = (data[i].id - pin) + ". " + data[i].nombre;
        }
        else
        {
            title.textContent = data[i].id + ". " + data[i].nombre;
        }

        //año de lanzamiento sin negrita
        const yearSpan = document.createElement("span");
        yearSpan.textContent = " (" + data[i].año + ")";

        title.appendChild(yearSpan);

        //desarrolladora
        const developer = document.createElement("div");
        developer.id = "developer";
        developer.textContent = data[i].desarrollador;

        //review
        const review = document.createElement("div");
        review.id = "review";
        review.textContent = data[i].review;


        titleContainer.appendChild(title);
        titleContainer.appendChild(developer);
        
        textContainer.appendChild(titleContainer);
        textContainer.appendChild(review);


        if (data[i].imagenFondo)
            card.appendChild(bg);
        card.appendChild(image);
        card.appendChild(textContainer);

        container.appendChild(card);
    }
}

export function sortByDefault()
{
    sortedBy = "default";
    defaultYear = 0;

    data.sort((a, b) => a.id - b.id);
    clearContainer();
    init();
}

export function sortByYear()
{
    sortedBy = "year";
    defaultYear = 0;

    data.sort((a, b) => a.id - b.id);
    data.sort((a, b) => a.año - b.año);
    clearContainer();
    init();
}

export function sortAlphabetically()
{
    sortedBy = "alphabetical";
    defaultYear = 0;

    data.sort((a, b) => a.id - b.id);
    data.sort((a, b) => a.nombre.localeCompare(b.nombre));
    clearContainer();
    init();
}

function clearContainer()
{
    const container = document.getElementById("container");
    while (container.firstChild)
    {
        container.removeChild(container.firstChild);
    }
}

function getVersion()
{
    if (!data || data.length === 0)
    {
        console.log("No data");
        return;
    }

    const lastYear = data[data.length - 1].añoJugado;
    const totalGames = data.length;
    const count = data.reduce((acc, item) => acc + (item.añoJugado === lastYear ? 1 : 0), 0);

    const versionDiv = document.getElementById("version");
    versionDiv.textContent = `v${lastYear}.${totalGames}.${count}.1 ${debug ? "(Debug)" : ""}`;
    
    }