var N_GENS = 8; //Aumentar valor según las generaciones aumenten

//Cambia las líneas visibles dependiendo de la generación seleccionada
function change(gen)
{
    //Hace invisibles todas las lineas dependientes de la generación.
    for (var i = 0; i < N_GENS; i++)
    {
        var genString = 'gen' + (i + 1);

        for (var j = 0; j < document.getElementsByClassName(genString).length; j++)
            document.getElementsByClassName(genString)[j].style.display= "none";

        //Resetea el color de todos los botones
        document.getElementById(genString).style.background='';
    }

    //console.log(gen);

    //Hace visible las lineas dependientes de la generación recibidas por parámetro
    for (var i = 0; i < document.getElementsByClassName(gen).length; i++)
        document.getElementsByClassName(gen)[i].style.display= "block";
    
    //Colorea el boton seleccionado
    document.getElementById(gen).style.background= 'rgb(255, 255, 255, 0.5)';
}
