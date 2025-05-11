import JSON from "./genshin.json" with { type: "json" };


var characterList = JSON.characters;

var elementList = JSON.elements;
var rarityList = JSON.rarity;
var weaponList = JSON.weapons;

var elementColorList = JSON.elementsColors;


export function load()
{
    createTable();
}

function createTable()
{
    //Create table
    var table = document.createElement("table");

    //Create header row
    var row = document.createElement("tr");

    //Blank cell for the first column
    var cell = document.createElement("th");
    
    cell.innerHTML = countUnlockedCharacters() + "/" + characterList.length;
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
    
    //TO DO: Save the state of the character in the JSON file

}



// export function saveCharactersToFile()
// {
//     const jsonData = JSON.stringify(characters, null, 2);

//     // Create a Blob with the JSON data
//     const blob = new Blob([jsonData], { type: "application/json" });

//     // Create a link element
//     const link = document.createElement("a");

//     // Set the download attribute with a filename
//     link.download = "characters00.json";

//     // Create a URL for the Blob and set it as the href attribute
//     link.href = URL.createObjectURL(blob);

//     // Append the link to the document, trigger the download, and remove the link
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// }

function countUnlockedCharacters()
{
    return characterList.filter(character => character.unlocked).length;
}