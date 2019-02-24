  var currentFileId = "";
  var maxLines = 10000;
  var currentLines = maxLines;
  var currentRequest;

  var currentTextSize = 14;
  var minTextSize = 7;
  var maxTextSize = 20;

  var scrolled = false;






  function getMarkers(){
    $("#assistance").submit(function(event){
      event.preventDefault();
      const environment = $('input[name=enviromentRadios]:checked').val();
      const country = $(".btn:first-child").text().trim();
      const assistanceId = $("#assistanceId").val();

      if(!validateForm(environment, country, assistanceId)){
        return
      }
      
      const environmentStr = environment == "option1" ? "pruebas" : "produccion";
      const countryStr = getCountry(country);
    
      console.log(countryStr);
      deleteAllMarkers();

      $.ajax({
        url: "/obtener/" + environmentStr + "/" + countryStr + "/" + assistanceId,
        method: "GET",
        dataType: "json",
        crossDomain: true,
      }).done(function(data){
          const total = data.length;
          if( total > 0){
            addMarkers(data);
            displaySuccess("Se encontraron " + total + " resultados");
          }else{
            displayWarning("No Se encontraron resultados para la asistencia.");
          }
      }).fail(function(data){
            displayWarning("Error de conexión intente mas tarde");
            console.log("ERROR " + JSON.stringify(data))
      })

    })
  }  

    function validateForm(environment, country, assistanceId){
      if(environment.length == 0 || country.length == 0 || assistanceId.length == 0){
        displayWarning("Todos los campos son necesarios")
        return false;
      }
      return true;
    }

    function displayWarning(message){
      $("#alertNotFound").text(message);
      $("#alertNotFound").show();
      $("#alertFound").hide();
    }

    function displaySuccess(message){
      $("#alertFound").text(message);
      $("#alertFound").show();
      $("#alertNotFound").hide();
    }

    function getCountry(country){
      var countryStr;
      switch(country) {
        case "Colombia":
          countryStr = "co";
          break;
        case "Guatemala":
          countryStr = "gt";
          break;
        case "Dóminicana":
          countryStr = "do";
          break;
        case "Ecuador":
          countryStr = "ec";
          break;
        case "Puerto Rico":
          countryStr = "pr"
          break;
        case "Uruguay":
          countryStr = "uy"
          break;
        default:
          countryStr = "co";
          break
      }

      return countryStr
    }


  $("#info").click(function(){
    const environment = $('input[name=enviromentRadios]:checked').val();
    const country = $(".btn:first-child").text().trim();

    const environmentStr = environment == "option1" ? "pruebas" : "produccion";
    const countryStr = getCountry(country).toUpperCase();;

   $.ajax({
      url: "/info/" + environmentStr + "/" + countryStr,
      method: "GET",
      dataType: "json",
      crossDomain: true,
    }).done(function(data){
        const dataContent = data[0];
        $("#distancia_arribo").text(dataContent.DISTANCIA_ARRIBO)
        $("#distancia_coordenadas").text(dataContent.DISTANCIA_COORDENADAS)
        $("#distancia_termino").text(dataContent.DISTANCIA_TERMINO)
        $("#primer_busqueda").text(dataContent.PRIMER_BUSQUEDA)
        $("#segunda_busqueda").text(dataContent.SEGUNDA_BUSQUEDA)
        $("#tiempo_ac").text(dataContent.TIEMPO_AC)
        $("#tiempo_coordenadas").text(dataContent.TIEMPO_COORDENADAS)
        $("#tiempo_deslogueo").text(dataContent.TIEMPO_DESLOGUEO)
        $("#tiempo_inac_libre").text(dataContent.TIEMPO_INAC_LIBRE)
        $("#tiempo_inac_ocupado").text(dataContent.TIEMPO_INAC_OCUPADO)
        
    }).fail(function(data){
        console.log(data)
    })
  });

  function getInfo(text){
    loadingLogs(true);
    $.ajax({
      url: "/logs/"+text,
      method: "GET",
      crossDomain: true,
    }).done(function(data){
      var regex = /\s*,\s*/;
      var fileList = data.split(regex);
      addList(fileList);
      loadingLogs(false);
        
    }).fail(function(data){
      console.log(data)
      loadingLogs(false);
    })
  }



  function addList(list){
    clearLogs();
    for(var i in list){
      if(list[i].length > 0){
        var strName = list[i]
        var active = i == 0 ? "active" : "";
        var str = '<li class="file-name list-group-item list-group-item-action '+active+'" style="font-family: monospace; font-size: 15px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 30px;display: inline-flex;" id='+strName+' data-toggle="list" href="" role="tab" aria-controls="home"><i class="material-icons" style="vertical-align: middle;margin-right: 10; word-wrap: break-word">insert_drive_file</i>'+strName+'</li>';
        $('#list-logs').append(str);
      }
    }
    // load initial information
    currentFileId = list[0];
    getLogById();

    $(".file-name").click(function(data){
      var id = $(this).attr('id');
      currentFileId = id;
      getLogById();
    })

    $('#logText').scroll(function() {
      var offset = this.scrollHeight; 
      if($('#logText').scrollTop() + $('#logText').height()  >= (offset - 100) ) {
        $("#top").css("display","block")
        $("#bottom").css("display","none")
        scrolled = true;
      }else{
        $("#top").css("display","none")
        $("#bottom").css("display","block")
        scrolled = false;
      }
   });

   $("#scroller").click(function(){
      scroll(scrolled);
   })
    
  }

function scroll(toTop){
  var $textarea = $('#logText');
  if(toTop){
    $textarea.scrollTop(0);
  }else{
    $textarea.scrollTop($textarea[0].scrollHeight);
  }
}

function getLogById(){
  $("#fileId").text(currentFileId);
  loading(true);
  if(currentRequest !=undefined){
    console.log("abort " + currentRequest)
    currentRequest.abort();
  }

  // execute log request for first instance 
  currentRequest = $.ajax({
    url: "/log/"+currentLines+"/"+currentFileId,
    method: "GET",
    crossDomain: true,
  }).done(function(data){
    $("#logText").text(data.length > 0 ? data: "Sin contenido");
    loading(false);
    scroll(false);
  }).fail(function(data){
    if(data.statusText != "abort"){
      loading(false);
    }
    $("#logText").text(data.responseText);
  });

}


$(document).ready(function(){
  getInfo("");
  
  $("#filter").submit(function(event){
    event.preventDefault();
    filter();
  })

  $('#reset').click(function(){
    $("#filterText").val('');
    filter();
  })

  $('#refresh').click(function(){
    if(getSelectedFilter() == "custom"){
      var count = $("#countLines").val();
      if(count >=1 && count < maxLines){
        currentLines = count;
      }else{
        $("#countLines").val(maxLines);
        currentLines = maxLines;
      }
    }else{
      $("#countLines").val(maxLines);
      currentLines = maxLines;

    }
    getLogById();
  })

  $('#zoomin').click(function(){
    if(currentTextSize > minTextSize){
      currentTextSize--;
    }
    $("#logText").css("fontSize", currentTextSize+"px");
  })
  $('#zoomout').click(function(){
    if(currentTextSize < maxTextSize){
      currentTextSize++;
    }
    $("#logText").css("fontSize", currentTextSize+"px");

  })
})

function filter(){
  const filterText = $("#filterText").val();
  if(filterText.length == 0){
    getInfo("")
    return
  }
  getInfo(filterText);
}


function changeNumberLines(){
  if(getSelectedFilter() == "custom"){
    document.getElementById("countLines").style.display = "block";
    currentLines = 100
    $("#countLines").val("100");
  }else{
    document.getElementById("countLines").style.display = "none";
    currentLines = maxLines;
  }
  getLogById();

}


function getSelectedFilter(){
  var e = document.getElementById("selectLines");
  var val = e.options[e.selectedIndex].value;
  return val;
}

function loading(isLoading){
  var e = document.getElementById("selectLines");
  $("#progress").css('display',isLoading ? "flex":"none");
  if(isLoading){
    $("#logText").text("Cargando ...");
  }
}

function loadingLogs(isLoading){
  if(isLoading){
    clearLogs();
  }
  $("#progressLog").css('visibility',isLoading ? "visible":"hidden");
 
}

function clearLogs(){
  $('#list-logs').html("");
}
