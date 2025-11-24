import data from "./data.json" with { type: "json" };

let gameList = data;
let globalFilter = null;
let globalSort = null;

//configuración
let debug = false;
getVersion('00');


export function init()
{
    setButtons();
    draw();

    debug ? null: scrollToTop();
}


function setButtons()
{
    const buttonHolder = document.getElementById("buttonHolder");
    let selectSort;
    let selectFilter;

    buttonHolder.textContent = "Ordenar:";

    //Select para ordenar
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

    //Select para filtrar
    selectFilter = document.createElement("select");

    const uniqueYears = Array.from(new Set(data.map(item => item.añoJugado).filter(y => y !== undefined)));
    uniqueYears.sort((a, b) => a - b);

    const filterOptions = [{ text: "por defecto", value: "" }].concat(
        uniqueYears.map(y => ({ text: String(y), value: String(y) }))
    );

    filterOptions.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.text;
        selectFilter.appendChild(option);
    });
    selectFilter.onchange = () => filterGames(selectFilter.value === "" ? null : parseInt(selectFilter.value));
    buttonHolder.appendChild(selectFilter);

    //Separador
    buttonHolder.appendChild(document.createElement("hr"));
}


function sortGames(sortType)
{
    globalSort = sortType;

    debug ? console.log("Sorting by " + globalSort) : null;

    gameList = data;
    gameList.sort((a, b) => a.id - b.id);

    switch (globalSort)
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

    draw();
}


function filterGames(year)
{
    globalFilter = year;
    
    debug ? console.log("Filtering by " + globalFilter) : null;

    draw();
}


function scrollToTop()
{
    // scroll to top of the list or page when resetting controls
    const container = document.getElementById("container");
    if (container)
        container.scrollTop = 0;

    // fallback to window scroll (smooth)
    if (typeof window !== "undefined" && window.scrollTo)
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}


function clearContainer(container)
{
    while (container.firstChild)
        container.removeChild(container.firstChild);
}


function draw()
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

    for (let i=0; i < gameList.length; i++)
    {
        separator = document.createElement("div");

        //Aplicar filtro
        if (globalFilter != null && gameList[i].añoJugado != globalFilter)
                continue;

        //Crear separador según ordenado
        switch (globalSort)
        {
            default:
            {
                if (gameList[i].añoJugado != lastData)
                {
                    lastData = gameList[i].añoJugado;
                    separator.textContent = "Jugado en " + lastData;

                    separator.className = "separator";
                    container.appendChild(separator);
                }
            }
            break;
            case "year":
            {
                if (gameList[i].año != lastData)
                {
                    lastData = gameList[i].año;
                    separator.textContent = lastData;

                    separator.className = "separator";
                    container.appendChild(separator);
                }
            }
            break;
            case "alphabetical":
            {
                if (gameList[i].nombre.charAt(0).toUpperCase() != lastData)
                {                    
                    lastData = gameList[i].nombre.charAt(0).toUpperCase();
                    separator.textContent = lastData;

                    separator.className = "separator";
                    container.appendChild(separator);
                }
            }
            break;
        }

        card = document.createElement("div");
        card.className = "card";
        card.id = gameList[i].añoJugado;

        if (gameList[i].imagenFondo)
        {
            bgImage = document.createElement("div");
            bgImage.className = "backgroundImage";
            bgImage.style.backgroundImage = `url("${gameList[i].imagenFondo}")`;

            if (gameList[i].id == 213)
                bgImage.id = "silksong";
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