import data from "./data.json" with { type: "json" };

let gameList = data;

//configuración
let debug = false;
getVersion('03');


export function init()
{
    setButtons();
    draw();
}

function setButtons()
{
    const buttonHolder = document.getElementById("buttonHolder");
    let selectSort;
    let selectFilter;

    buttonHolder.textContent = "Ordenar:";

    selectSort = document.createElement("select");
    [
        { text: "por defecto", value: "" },
        { text: "A-Z", value: "alphabetical" },
        { text: "por año", value: "year" }
    ].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.text;
        selectSort.appendChild(option);
    });
    selectSort.onchange = () => sortGames(selectSort.value === "" ? null : selectSort.value);
    buttonHolder.appendChild(selectSort);

    buttonHolder.appendChild(document.createTextNode("Filtrar:"));

    selectFilter = document.createElement("select");
    [
        { text: "por defecto", value: "" },
        { text: "2020", value: "2020" },
        { text: "2021", value: "2021" },
        { text: "2022", value: "2022" },
        { text: "2023", value: "2023" }
    ].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.text;
        selectFilter.appendChild(option);
    });
    selectFilter.onchange = () => filterGames(selectFilter.value === "" ? null : parseInt(selectFilter.value));
    buttonHolder.appendChild(selectFilter);

    buttonHolder.appendChild(document.createElement("hr"));
}

function createButton(buttonHolder, text, onClickFunc)
{
    let button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClickFunc;
    buttonHolder.appendChild(button);
}

function sortGames(sortType)
{
    debug ? console.log("Sorting by " + sortType) : null;

    resetSortAndFilter(1);

    gameList = data;
    gameList.sort((a, b) => a.id - b.id);

    switch (sortType)
    {        
        case "year":
        {
            gameList.sort((a, b) => a.año - b.año);
        }
        break;
        case "alphabetical":
        {
            gameList.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
        break;
    }

    draw(sortType);
}

function filterGames(year)
{
    debug ? console.log("Filtering by " + year) : null;

    resetSortAndFilter(0);

    gameList = data;
    gameList.sort((a, b) => a.id - b.id);

    if (year != null)
    {
        gameList = gameList.filter(item => item.añoJugado === year);
    }

    draw();
}

//Burrada hecha mientras no sé combinar los dos select
function resetSortAndFilter(pos)
 {
        const buttonHolder = document.getElementById("buttonHolder");
    if (buttonHolder) {
        const selects = buttonHolder.querySelectorAll("select");
        if (selects.length > 1) {
            // reset sort select to default
            selects[pos].value = "";
        }
    }
 }



function clearContainer(container)
{
    while (container.firstChild)
        container.removeChild(container.firstChild);
}


function draw(sortType)
{
    const container = document.getElementById("container");
    let card;
    let bgImage;
    let coverImage;
    let textContainer;
    let titleContainer;
    let title;
    let year;
    let developer;
    let review;

    let debugFlagYear = 0;
    let debugFlagId = 0;

    clearContainer(container);

    let separator;

    let lastData = null;
    let isDataUpdated = false;

    for (let i=0; i < gameList.length; i++)
    {
        separator = document.createElement("div");
        
        isDataUpdated = false;

        switch (sortType)
        {
            default:
            {
                if (gameList[i].añoJugado != lastData)
                {
                    lastData = gameList[i].añoJugado;
                    separator.textContent = "Jugado en " + lastData;
                    isDataUpdated = true;
                }
            }
            break;
            case "year":
            {
                if (gameList[i].año != lastData)
                {
                    lastData = gameList[i].año;
                    separator.textContent = lastData;
                    isDataUpdated = true;
                }
            }
            break;
            case "alphabetical":
            {
                if (gameList[i].nombre.charAt(0).toUpperCase() != lastData)
                {                    
                    lastData = gameList[i].nombre.charAt(0).toUpperCase();
                    separator.textContent = lastData;
                    isDataUpdated = true;
                }
            }
            break;
        }

        if (isDataUpdated)
        {
            separator.className = "separator";
            container.appendChild(separator);
        }


        card = document.createElement("div");
        card.className = "card";
        card.id = gameList[i].añoJugado;

        if (gameList[i].imagenFondo)
        {
            bgImage = document.createElement("div");
            bgImage.className = "backgroundImage";
            bgImage.style.backgroundImage = `url("${gameList[i].imagenFondo}")`;
        }

        coverImage = document.createElement("img");
        coverImage.className = "image";
        coverImage.src = gameList[i].imagen;

        textContainer = document.createElement("div");
        textContainer.className = "textContainer";

        titleContainer = document.createElement("div");
        titleContainer.className = "titleContainer";

        title = document.createElement("div");
        title.className = "title";

        if (debug && !sortType)
        {
            if (gameList[i].añoJugado != debugFlagYear)
            {
                debugFlagYear = gameList[i].añoJugado;
                debugFlagId = gameList[i].id - 1;
            }
            title.textContent = (gameList[i].id-debugFlagId) + ". " + gameList[i].nombre;
        }
        else
            title.textContent = gameList[i].id + ". " + gameList[i].nombre;

        year = document.createElement("span");
        year.textContent = " (" + gameList[i].año + ")";
        title.appendChild(year);

        developer = document.createElement("div");
        developer.className = "developer";
        developer.textContent = gameList[i].desarrollador;

        review = document.createElement("div");
        review.className = "review";
        review.textContent = gameList[i].review;

        titleContainer.appendChild(title);
        titleContainer.appendChild(developer);
        
        textContainer.appendChild(titleContainer);
        textContainer.appendChild(review);


        if (gameList[i].imagenFondo)
            card.appendChild(bgImage);
        card.appendChild(coverImage);
        card.appendChild(textContainer);

        container.appendChild(card);
    }
}

function getVersion(rev)
{
    if (!gameList || gameList.length === 0)
    {
        console.log("No data");
        return;
    }

    const lastYear = gameList[gameList.length - 1].añoJugado;
    const totalGames = gameList.length;
    const count = gameList.reduce((acc, item) => acc + (item.añoJugado === lastYear ? 1 : 0), 0);

    const versionDiv = document.getElementById("version");
    versionDiv.textContent = `v${lastYear}.${totalGames}.${count}.${rev} ${debug ? "(Debug)" : ""}`;
}