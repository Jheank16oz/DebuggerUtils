var app = new Vue({
  el: '#app',
  data: {
    search: 'Busqueda',
    isLogLoading: false,
    currentFileId: '',
    maxLines: 10000,
    currentLines: 10000,
    currentRequest: null,
    currentTextSize: 14,
    minTextSize: 7,
    maxTextSize: 20,
    scrolled: false

  },
  methods: {
    addList(list) {
      this.clearLogs()
      var self = this
      for (var i in list) {
        if (list[i].length > 0) {
          var strName = list[i]
          var active = i == 0 ? 'active' : ''
          var str = '<li class="file-name list-group-item list-group-item-action ' + active + '" style="font-family: monospace; font-size: 15px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 30px;display: inline-flex;" id=' + strName + ' data-toggle="list" href="" role="tab" aria-controls="home"><i class="material-icons" style="vertical-align: middle;margin-right: 10; word-wrap: break-word">insert_drive_file</i>' + strName + '</li>'
          $('#list-logs').append(str)
        }
      }
      // load initial information
      this.currentFileId = list[0]
      this.getLogById()

      $('.file-name').click(function (data) {
        var id = $(this).attr('id')
        self.currentFileId = id
        self.getLogById()
      })

      $('#logText').scroll(function () {
        var offset = this.scrollHeight
        if ($('#logText').scrollTop() + $('#logText').height() >= (offset - 100)) {
          $('#top').css('display', 'block')
          $('#bottom').css('display', 'none')
          self.scrolled = true
        }else {
          $('#top').css('display', 'none')
          $('#bottom').css('display', 'block')
          self.scrolled = false
        }
      })

      $('#scroller').click(function () {
        self.scroll(self.scrolled)
      })
    }, getInfo(text) {
      this.isLogLoading = true
      var self = this
      $.ajax({
        url: '/logs/' + text,
        method: 'GET',
        crossDomain: true
      }).done(function (data) {
        var regex = /\s*,\s*/
        var fileList = data.split(regex)
        self.isLogLoading = false
        self.addList(fileList)
      }).fail(function (data) {
        console.log(data)
        self.isLogLoading = false
      })
    },
    clearLogs() {
      $('#list-logs').html('')
    },
    getLogById() {
      $('#fileId').text(this.currentFileId)
      this.loading(true)
      if (this.currentRequest != undefined) {
        console.log('abort ' + this.currentRequest)
        this.currentRequest.abort()
      }
      var self = this
      // execute log request for first instance 
      this.currentRequest = $.ajax({
        url: '/log/' + this.currentLines + '/' + this.currentFileId,
        method: 'GET',
        crossDomain: true
      }).done(function (data) {
        $('#logText').text(data.length > 0 ? data : 'Sin contenido')
        self.loading(false)
        self.scroll(false)
      }).fail(function (data) {
        if (data.statusText != 'abort') {
          self.loading(false)
        }
        $('#logText').text(data.responseText)
      })
    },
    scroll(toTop) {
      var $textarea = $('#logText')
      if (toTop) {
        $textarea.scrollTop(0)
      }else {
        $textarea.scrollTop($textarea[0].scrollHeight)
      }
    },
    updateCurrentTextSizeUI() {
      $('#currentTexSize').text(currentTextSize + 'px')
    },
    filter() {
      const filterText = $('#filterText').val()
      if (filterText.length == 0) {
        this.getInfo('')
        return
      }
      this.getInfo(filterText)
    },
    changeNumberLines() {
      if (this.getSelectedFilter() == 'custom') {
        document.getElementById('countLines').style.display = 'block'
        this.currentLines = 100
        $('#countLines').val('100')
      }else {
        document.getElementById('countLines').style.display = 'none'
        this.currentLines = this.maxLines
      }
      this.getLogById()
    },
    getSelectedFilter() {
      var e = document.getElementById('selectLines')
      var val = e.options[e.selectedIndex].value
      return val
    },
    loading(isLoading) {
      $('#progress').css('display', isLoading ? 'flex' : 'none')
      if (isLoading) {
        $('#logText').text('Cargando ...')
      }
    }
  },
  mounted() {
    var self = this
    this.getInfo('')
    $('#filter').submit(function (event) {
      event.preventDefault()
      self.filter()
    })

    $('#reset').click(function () {
      $('#filterText').val('')
      self.filter()
    })

    $('#refresh').click(function () {
      if (self.getSelectedFilter() == 'custom') {
        var count = $('#countLines').val()
        if (count >= 1 && count < self.maxLines) {
          self.currentLines = count
        }else {
          $('#countLines').val(self.maxLines)
          self.currentLines = self.maxLines
        }
      }else {
        $('#countLines').val(self.maxLines)
        self.currentLines = self.maxLines
      }
      self.getLogById()
    })

    $('#zoomin').click(function () {
      if (self.currentTextSize > self.minTextSize) {
        self.currentTextSize--
      }
      $('#logText').css('fontSize', self.currentTextSize + 'px')
      self.updateCurrentTextSizeUI()
    })
    $('#zoomout').click(function () {
      if (self.currentTextSize < self.maxTextSize) {
        self.currentTextSize++
      }
      $('#logText').css('fontSize', self.currentTextSize + 'px')
      self.updateCurrentTextSizeUI()
    })
  }
})
