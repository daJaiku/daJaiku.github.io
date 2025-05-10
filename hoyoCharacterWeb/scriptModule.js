import characters from "./characters.json" with { type: "json" };

var n = characters.length;

var elements = ["Pyro", "Hydro", "Dendro", "Electro", "Anemo", "Cryo", "Geo"]
var rarity = ["★★★★☆", "★★★★★"]
var weapons = ["Espada", "Mandoble", "Lanza", "Arco", "Catalizador"]

var id = 0;


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
    cell.innerHTML = countUnlockedCharacters() + "/" + characters.length;
    cell.setAttribute("id", "count");
    row.appendChild(cell);

    //Create header cells for each element and rarity
    for(var i = 0; i < elements.length*rarity.length; i++)
    {

        cell = document.createElement("th");
        cell.innerHTML = elements[parseInt((i/2))] + "<br>" + rarity[i%2];

        cell.classList.add(elements[parseInt((i/2))] + (4+i%2));

        row.appendChild(cell);      
    }
    table.appendChild(row);

    //Create rows for each weapon
    for (var i = 0; i < weapons.length; i++)
    {
        row = document.createElement("tr");

        cell = document.createElement("th");
        cell.innerHTML = weapons[i];
        row.appendChild(cell);

        
        //Create cells for each element and rarity
        for(var j = 0; j < elements.length*rarity.length; j++)
        {
            cell = document.createElement("td");
            cell.setAttribute("class", elements[parseInt((j/2))] + (4+j%2));

            var filteredList = characters.filter(character => character.element == elements[parseInt((j/2))] && 
                                                 character.rarity == (4+j%2) && character.weapon == weapons[i]);

            if(filteredList.length != 0) 
                //Create buttons for each character
                for (var k = 0; k < filteredList.length; k++)
                {
                    var button = document.createElement("div");


                    button.setAttribute("id", id);
                    button.setAttribute("onclick", "changeState("+id+")");
                    id++;


                    button.innerHTML = filteredList[k].name;
                    cell.appendChild(button);
                }

            row.appendChild(cell);      
        }

        table.appendChild(row);
    }

    document.body.appendChild(table);
}


export function changeState(buttonId)
{
    //Get the button that was clicked
    var button = document.getElementById(buttonId);

    //Get the name of the button that was clicked
    var characterName = button.innerHTML;

    //Get the parent cell of the button
    var cellCategory = button.parentElement.getAttribute("class");


    var character = characters.find(c => c.name === characterName);
    character.unlocked = !character.unlocked;

    if(!character.unlocked)
    {
        button.style.backgroundColor = "";
        button.style.color = "";
    }
    else
    {
        button.style.backgroundColor = "#222";
       

        switch(cellCategory)
        {
            case "Pyro4":
                 button.style.color = "#e18a70";
                break;
            case "Hydro4":
                button.style.color = "#00c6ff";
                break;
            case "Dendro4":
                button.style.color = "#93cd29";
                break;
            case "Electro4":
                button.style.color = "#c19cff";
                break;
            case "Anemo4":
                button.style.color = "#89d7cc";
                break;
            case "Cryo4":
                button.style.color = "#a6dbf9";
                break;
            case "Geo4":
                button.style.color = "#d7b861";
                break;
            case "Pyro5":
                button.style.color = "#ffa870";
                break;
            case "Hydro5":
                button.style.color = "#04e8ff";
                break;
            case "Dendro5":
                button.style.color = "#b1eb29";
                break;
            case "Electro5":
                button.style.color = "#dfbaff";
                break;
            case "Anemo5":
                button.style.color = "#a7f5cc";
                break;
            case "Cryo5":
                button.style.color = "#c4f9f9";
                break;
            case "Geo5":
                button.style.color = "#f5d661";
                break;
        }   
    }   

    var countCell = document.getElementById("count");
    countCell.innerHTML = countUnlockedCharacters() + "/" + characters.length; 
    
    //TO DO: Save the state of the character in the JSON file

}



export function saveCharactersToFile()
{
    const jsonData = JSON.stringify(characters, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute with a filename
    link.download = "characters00.json";

    // Create a URL for the Blob and set it as the href attribute
    link.href = URL.createObjectURL(blob);

    // Append the link to the document, trigger the download, and remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function countUnlockedCharacters()
{
    var count = 0;
    for (var i = 0; i < characters.length; i++)
    {
        if (characters[i].unlocked)
            count++;
    }
    return count;
}