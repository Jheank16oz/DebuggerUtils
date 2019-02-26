function getMarkers () {
  $('#assistance').submit(function (event) {
    event.preventDefault()
    const environment = $('input[name=enviromentRadios]:checked').val()
    const country = $('.btn:first-child').text().trim()
    const assistanceId = $('#assistanceId').val()

    if (!validateForm(environment, country, assistanceId)) {
      return
    }

    const environmentStr = environment == 'option1' ? 'pruebas' : 'produccion'
    const countryStr = getCountry(country)

    console.log(countryStr)
    deleteAllMarkers()

    $.ajax({
      url: '/obtener/' + environmentStr + '/' + countryStr + '/' + assistanceId,
      method: 'GET',
      dataType: 'json',
      crossDomain: true
    }).done(function (data) {
      const total = data.length
      if (total > 0) {
        addMarkers(data)
        displaySuccess('Se encontraron ' + total + ' resultados')
      }else {
        displayWarning('No Se encontraron resultados para la asistencia.')
      }
    }).fail(function (data) {
      displayWarning('Error de conexión intente mas tarde')
      console.log('ERROR ' + JSON.stringify(data))
    })
  })
}

function validateForm (environment, country, assistanceId) {
  if (environment.length == 0 || country.length == 0 || assistanceId.length == 0) {
    displayWarning('Todos los campos son necesarios')
    return false
  }
  return true
}

function displayWarning (message) {
  $('#alertNotFound').text(message)
  $('#alertNotFound').show()
  $('#alertFound').hide()
}

function displaySuccess (message) {
  $('#alertFound').text(message)
  $('#alertFound').show()
  $('#alertNotFound').hide()
}

function getCountry (country) {
  var countryStr
  switch (country) {
    case 'Colombia':
      countryStr = 'co'
      break
    case 'Guatemala':
      countryStr = 'gt'
      break
    case 'Dóminicana':
      countryStr = 'do'
      break
    case 'Ecuador':
      countryStr = 'ec'
      break
    case 'Puerto Rico':
      countryStr = 'pr'
      break
    case 'Uruguay':
      countryStr = 'uy'
      break
    default:
      countryStr = 'co'
      break
  }

  return countryStr
}

$('#info').click(function () {
  const environment = $('input[name=enviromentRadios]:checked').val()
  const country = $('.btn:first-child').text().trim()

  const environmentStr = environment == 'option1' ? 'pruebas' : 'produccion'
  const countryStr = getCountry(country).toUpperCase()

  $.ajax({
    url: '/info/' + environmentStr + '/' + countryStr,
    method: 'GET',
    dataType: 'json',
    crossDomain: true
  }).done(function (data) {
    const dataContent = data[0]
    $('#distancia_arribo').text(dataContent.DISTANCIA_ARRIBO)
    $('#distancia_coordenadas').text(dataContent.DISTANCIA_COORDENADAS)
    $('#distancia_termino').text(dataContent.DISTANCIA_TERMINO)
    $('#primer_busqueda').text(dataContent.PRIMER_BUSQUEDA)
    $('#segunda_busqueda').text(dataContent.SEGUNDA_BUSQUEDA)
    $('#tiempo_ac').text(dataContent.TIEMPO_AC)
    $('#tiempo_coordenadas').text(dataContent.TIEMPO_COORDENADAS)
    $('#tiempo_deslogueo').text(dataContent.TIEMPO_DESLOGUEO)
    $('#tiempo_inac_libre').text(dataContent.TIEMPO_INAC_LIBRE)
    $('#tiempo_inac_ocupado').text(dataContent.TIEMPO_INAC_OCUPADO)
  }).fail(function (data) {
    console.log(data)
  })
})
