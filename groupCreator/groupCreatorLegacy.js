
var nameList = [];


function addRow(name)
{
    var div = document.createElement("div");
    div.innerHTML = name;


    var table = document.getElementById("nameTable").getElementsByTagName("tbody")[0];
    var row = table.insertRow();
    var cellName = row.insertCell(0);
    var cellOptions = row.insertCell(1);
    var cellBlackList = row.insertCell(2);


    //añadir el nombre a la primera celda
    cellName.innerHTML = name
    nameList.push(name)


    //añadir un botón de eliminar a la tercera celda
    var buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "Eliminar fila";
    buttonDelete.onclick = function()
    {
        removeRow(name);
    };
    
    cellOptions.appendChild(buttonDelete);


    //añadir un desplegable con los nombres a la segunda celda
    var select = document.createElement("select");
    cellOptions.appendChild(select);

    updateDesplegables();


    //añadir un botón para añadir a la blacklist
    var addButton = document.createElement("button");
    addButton.innerHTML = "Añadir";
    addButton.onclick = function()
    {

        //añadir los nombres a la blacklist
        for (var i = 0; i < table.rows.length; i++)
        {
            if (table.rows[i].cells[0].innerHTML === select.value)
            {

                var buttonBlackList = document.createElement("button");
                buttonBlackList.innerHTML = select.value;
                buttonBlackList.onclick = function()
                {
                    cellBlackList.removeChild(buttonBlackList);
                    table.rows[i].cells[2].removeChild(buttonBlackList2);
                };


                var buttonBlackList2 = document.createElement("button");
                buttonBlackList2.innerHTML = name;
                buttonBlackList2.onclick = function()
                {
                    cellBlackList.removeChild(buttonBlackList);
                    table.rows[i].cells[2].removeChild(buttonBlackList2);     
                };

                cellBlackList.appendChild(buttonBlackList);
                table.rows[i].cells[2].appendChild(buttonBlackList2);
                break;
            }
        }

        select.value = "";
    };

    cellOptions.appendChild(addButton);

    // Limpiar el input
    document.getElementById("nameInput").value = "";
}


function removeRow(name)
{

    //return; // Desactivar la función de eliminar fila
            //pendiente de arreglar bugs



    var table = document.getElementById("nameTable").getElementsByTagName("tbody")[0];
    for (var i = 0, row; row = table.rows[i]; i++)
    {
        if (row.cells[0].innerHTML === name)
        {
            for (var j = row.cells[2].children.length - 1; j >= 0; j--)
            {
                console.log("Eliminando botón de blacklist:", row.cells[2].children[j].innerHTML);
                row.cells[2].children[j].onclick();

            }
                

            table.deleteRow(i);
            nameList.splice(nameList.indexOf(name), 1);
            updateDesplegables();
        }
    } 


}   


function updateDesplegables()
{
    var selections = document.getElementsByTagName("select");

    for (var i = 0; i < selections.length; i++)
    {
        var select = selections[i];
        select.innerHTML = "";
        // Añadir opción nula
        var emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.innerHTML = "-- Ninguno --";
        select.appendChild(emptyOption);



        
        for (var j = 0; j < nameList.length; j++)
            {
            // Saltar si el valor del select es igual al nombre actual
            if (select.parentElement && select.parentElement.previousSibling && select.parentElement.previousSibling.innerHTML === nameList[j])
            {
                continue;
            }
            var option = document.createElement("option");
            option.value = nameList[j];
            option.innerHTML = nameList[j];
            select.appendChild(option);
        }
    }
}









function createGroup(n_groups)
{
    console.log(nameList)
    console.log(n_groups)

    //console.log(blackListExtraction());

    nameList = randomizeArray(nameList);

    var groups = [];
    for (var i = 0; i < n_groups; i++)
    {
        groups.push([]);
    }

    for (var i = 0; i < nameList.length; i++)
    {
        groups[i % n_groups].push(nameList[i]);
    }
    console.log(groups);

    var outputDiv = document.getElementById("output2");
    outputDiv.innerHTML = "";
    for (var i = 0; i < groups.length; i++)
    {
        var groupDiv = document.createElement("div");
        groupDiv.innerHTML = "<h3>Grupo " + (i + 1) + "</h3>";
        for (var j = 0; j < groups[i].length; j++)
        {
            var nameDiv = document.createElement("div");
            nameDiv.innerHTML = groups[i][j];
            groupDiv.appendChild(nameDiv);
        }
        outputDiv.appendChild(groupDiv);
    }

}


function randomizeArray(list)
{
    list.sort(() => Math.random() - 0.5);
    console.log("Array randomizado:", list);
    return list;
}


function blackListExtraction()
{
    var textArea = document.getElementById("blacklistInput");
    console.log("Contenido del textarea:", textArea.value);


   var blackList = textArea.value.split(" ").map(function(item) {
       return item.trim();
   }).filter(function(item) {
       return item !== "";
   });
   console.log("Blacklist extraída:", blackList);
   return blackList;
}