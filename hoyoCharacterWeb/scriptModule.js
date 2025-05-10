import characters from "./characters.json" with { type: "json" };

var n = characters.length;

var elements = ["Pyro", "Hydro", "Dendro", "Electro", "Anemo", "Cryo", "Geo"]
var rarity = ["★★★★☆", "★★★★★"]
var weapons = ["Espada", "Mandoble", "Lanza", "Arco", "Catalizador"]

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
    cell.innerHTML = characters.length;
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
                    button.innerHTML = filteredList[k].name;
                    cell.appendChild(button);
                }

            row.appendChild(cell);      
        }

        table.appendChild(row);
    }

    document.body.appendChild(table);
}

