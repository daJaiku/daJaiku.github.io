
var nameList = [];

//Añadir una fila a la tabla con el nombre y sus botones
function addRow(name)
{
    var table = document.getElementById("nameTable").getElementsByTagName("tbody")[0];
    var row = table.insertRow();

    var cellName = row.insertCell(0);
    var cellOptions = row.insertCell(1);
    var cellBlackList = row.insertCell(2);


    // Añadir el nombre a la celda y a la lista
    cellName.textContent = name;
    nameList.push(name);


    // Botón para eliminar la fila
    var buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "Eliminar fila";
    buttonDelete.onclick = function()
    {
        removeRow(name);
    };

    buttonDelete.id = "deleteButton";
    cellOptions.appendChild(buttonDelete);


    // Desplegable para seleccionar nombres para blacklist
    var select = document.createElement("select");
    cellOptions.appendChild(select);
    updateDesplegables();


    // Botón para añadir a blacklist
    var addButton = document.createElement("button");
    addButton.innerHTML = "Añadir";
    addButton.onclick = function()
    {


        // return si el valor seleccionado está en la lista negra
        var table = document.getElementById("nameTable").getElementsByTagName("tbody")[0];
        var buttons = cellBlackList.getElementsByTagName("button");
        for (var b = 0; b < buttons.length; b++)
        {
            if (buttons[b].innerHTML === select.value)
            {
                select.value = "";
                return;
            }
        }

        // buscar la fila objetivo por valor del select
        for (let k = 0; k < table.rows.length; k++)
        {
            const targetRow = table.rows[k];
            if (targetRow.cells[0].innerHTML === select.value)
            {
                // crear un id único para el par
                const pairId = 'pair_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);

                // botones pareja
                const buttonBlackList = document.createElement("button");
                const buttonBlackList2 = document.createElement("button");

                buttonBlackList.className = "blacklistButton";
                buttonBlackList2.className = "blacklistButton";

                buttonBlackList.dataset.pairId = pairId;
                buttonBlackList2.dataset.pairId = pairId;

                buttonBlackList.textContent = select.value;
                buttonBlackList2.textContent = name;

                // handler que borra ambas entradas asociadas al pairId
                const removePair = function()
                {
                    const id = this.dataset.pairId;
                    if (!id) return;
                    document.querySelectorAll(`button[data-pair-id="${id}"]`).forEach(b =>{
                        if (b.parentNode) b.parentNode.removeChild(b);
                    });
                };

                buttonBlackList.addEventListener('click', removePair);
                buttonBlackList2.addEventListener('click', removePair);

                // añadir a las celdas correspondientes
                cellBlackList.appendChild(buttonBlackList);
                targetRow.cells[2].appendChild(buttonBlackList2);
                break;
            }
        }
        select.value = "";
    };

    cellOptions.appendChild(addButton);
    document.getElementById("nameInput").value = "";
}


function removeRow(name)
{
    var table = document.getElementById("nameTable").getElementsByTagName("tbody")[0];
    for (var i = 0; i < table.rows.length; i++)
    {
        var row = table.rows[i];
        if (row.cells[0].innerHTML === name)
        {
            // eliminar todas las buttons de esa celda de blacklist de forma segura
            var botones = Array.from(row.cells[2].querySelectorAll('button'));
            botones.forEach(btn => {
                const pid = btn.dataset.pairId;
                if (pid)
                {
                    // elimina ambas mitades del par si existen
                    document.querySelectorAll(`button[data-pair-id="${pid}"]`).forEach(b => {
                        if (b.parentNode) b.parentNode.removeChild(b);
                    });
                }
                else
                {
                    if (btn.parentNode)
                        btn.parentNode.removeChild(btn);
                }
            });

            table.deleteRow(i);
            var idx = nameList.indexOf(name);
            if (idx !== -1) nameList.splice(idx, 1);
            updateDesplegables();
            break;
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
    blackList = blackListExtraction()

    var conflict = true;


    var groups = [];
    for (var i = 0; i < n_groups; i++)
        groups.push([]);


    var att = 0;
    while (conflict)
    {
        att += 1;
        nameList = randomizeArray(nameList);


        for (var i = 0; i < nameList.length; i++)
            groups[i % n_groups].push(nameList[i]);

        console.log(groups);

        // Comprobar que no hay conflictos
        var conflict = false;

        for (var i = 0; i < groups.length; i++)
        {
            for (var j = 0; j < groups[i].length; j++)
            {
                var member = groups[i][j];
                if (blackList[member])
                {
                    for (var k = 0; k < blackList[member].length; k++)
                    {
                        if (groups[i].includes(blackList[member][k]))
                        {
                            conflict = true;
                            break;
                        }
                    }
                }
                if (conflict) break;
            }
            if (conflict) break;
        }
        if (conflict)
        {
            console.log("Conflicto detectado, reintentando... (Intento " + att + ")");
            for (var i = 0; i < groups.length; i++)
                groups[i] = [];
        }

        if (att > 1000)
        {
            alert("No se pudo organizar los grupos sin conflictos después de 1000 intentos. Por favor, revise las restricciones.");
            return;
        }
    }

    var outputDiv = document.getElementById("output2");
    outputDiv.innerHTML = "";

    // Crear un contenedor flex para los grupos
    var groupsContainer = document.createElement("div");
    groupsContainer.style.display = "flex";
    groupsContainer.style.gap = "24px"; // Espacio entre grupos

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
        groupsContainer.appendChild(groupDiv);
    }

    outputDiv.appendChild(groupsContainer);

}





function blackListExtraction()
{
    var table = document.getElementById("nameTable").getElementsByTagName("tbody")[0];
    var blackList = {};
    for (var i = 0; i < table.rows.length; i++)
    {
        var row = table.rows[i];
        var name = row.cells[0].innerHTML;
        blackList[name] = [];
        var buttons = row.cells[2].getElementsByTagName("button");
        for (var j = 0; j < buttons.length; j++)
        {
            blackList[name].push(buttons[j].innerHTML);
        }
    }
    console.log("Blacklist extraída:", blackList);
    return blackList;
}


function randomizeArray(list)
{
    list.sort(() => Math.random() - 0.5);
    console.log("Array randomizado:", list);
    return list;
}