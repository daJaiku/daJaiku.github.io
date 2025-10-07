import JSONfile from "./honkai.json" with { type: "json" };


var characterList;

var elementList;
var rarityList;
var weaponList;

var elementColorList;

var localFile;


export function load()
{
    characterList = JSONfile.characters;

    elementList = JSONfile.elements;
    rarityList = JSONfile.rarity;
    weaponList = JSONfile.weapons;

    elementColorList = JSONfile.elementsColors;

    createTable();
}

function createTable()
{
    var table;
    var row;
    var cell;


    table = document.createElement("table");

    row = document.createElement("tr");

    cell = document.createElement("th");
    cell.innerHTML = 0 + "/" + characterList.length;
    cell.setAttribute("id", "count");
    row.appendChild(cell);

    //Create header cells for each element and rarity
    for(var i = 0; i < elementList.length*rarityList.length; i++)
    {
        cell = document.createElement("th");
        cell.innerHTML = elementList[parseInt((i/rarityList.length))] + "<br>" + rarityList[i%rarityList.length];

        cell.style.backgroundColor = elementColorList[i];

        row.appendChild(cell);      
    }
    table.appendChild(row);


    //Create rows for each weapon
    for (var i = 0; i < weaponList.length; i++)
    {
        row = document.createElement("tr");

        cell = document.createElement("th");
        cell.innerHTML = weaponList[i];
        row.appendChild(cell);

        
        //Create cells for each element and rarity
        for(var j = 0; j < elementList.length*rarityList.length; j++)
        {
            cell = document.createElement("td");
            cell.style.backgroundColor = elementColorList[j];

            var filteredList = characterList.filter(character => character.element == elementList[parseInt((j/rarityList.length))] && 
                                                 character.rarity == (4+j%rarityList.length) && character.weapon == weaponList[i]);

            //Create buttons for each character
            for (var k = 0; k < filteredList.length; k++)
            {
                var button = document.createElement("div");

                button.setAttribute("onclick", "changeState(this)");

                button.innerHTML = filteredList[k].name;
                cell.appendChild(button);                    
            }
            row.appendChild(cell);      

        }
        table.appendChild(row);

    }
    document.body.appendChild(table);
}


export function changeState(button)
{
    var characterName = button.innerHTML;
    var cellColor = button.parentElement.style.backgroundColor;

    //Sistema de seguridad para el caso de que haya un personaje con el mismo nombre
    var colorIndex = (Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement)-1);
    var characterElement = parseInt(colorIndex/rarityList.length);

    var character = characterList.find(c => c.name === characterName && c.element == elementList[characterElement]);

    character.unlocked = !character.unlocked;

    if(!character.unlocked)
    {
        button.style.backgroundColor = "";
        button.style.color = "";
    }
    else
    {
        button.style.backgroundColor = "#222";
        button.style.color = cellColor;
    }   

    var countCell = document.getElementById("count");
    countCell.innerHTML = countUnlockedCharacters() + "/" + characterList.length; 
    
}


function countUnlockedCharacters()
{
    return characterList.filter(character => character.unlocked).length;
}




export function loadJSON()
{
    //Load JSON file
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = e => { 
        var file = e.target.files[0]; 
        var reader = new FileReader();
        reader.onload = function(event)
        {
            //console.log(event.target.result);
            localFile = JSON.parse(event.target.result);
            var localCharacterList = localFile.characters;
                    
            //recorrer todos los botones y cambiar el estado de los personajes
            var buttons = document.getElementsByTagName("div");
            for (var i = 0; i < buttons.length; i++)
            {
                var button = buttons[i];
                var characterName = button.innerHTML;
                var colorIndex = (Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement)-1);
                var characterElement = parseInt(colorIndex/rarityList.length);
                var character = characterList.find(c => c.name === characterName && c.element === elementList[characterElement] && c.unlocked);

                if(character)
                {
                    changeState(button);
                }

                character = localCharacterList.find(c => c.name === characterName && c.unlocked);
                if(character)
                {
                    changeState(button);
                }

            }
        }
        reader.readAsText(file);

    }
    input.click();

}

export function saveJSON()
{
    var unlockedCharacters = characterList.filter(character => character.unlocked);

    if(unlockedCharacters.length == 0)
    {
        return;
    }

    //Save JSON file
    console.log("Saving JSON file");
    var json = JSON.stringify(JSONfile);
    var blob = new Blob([json], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "genshin.json";
    a.click();
    URL.revokeObjectURL(url);
}