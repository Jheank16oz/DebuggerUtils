Vue.config.devtools = true
var app = new Vue({
  el: '#app',
  data: {
    isLogLoading: false,
    isDetailLoading: false,
    currentFileId: '',
    maxLines: 10000,
    currentRequest: null,
    fontSize: 14,
    minTextSize: 7,
    maxTextSize: 20,
    scrolled: false,
    logs: [],
    detailStr: '...',
    filter: '',
    filterLines: 10000,
    filterType: 'all'
  },
  methods: {
    onItemClick(index) {
      this.currentFileId = this.logs[index]
      this.getDetailByLog()
    },
    addList(list) {
      this.logs = list
      this.currentFileId = this.logs[0]
      this.getDetailByLog()
    },
    getInfo(text) {
      // clear logs
      this.logs = []
      this.isLogLoading = true
      var self = this
      $.ajax({
        url: '/logs/' + text,
        method: 'GET',
        crossDomain: true
      }).done(function (data) {
        var fileList = data.split(/[ * ,]+/).filter(function (e) { return e.trim().length > 0; })
        self.addList(fileList)
        self.isLogLoading = false
      }).fail(function (data) {
        self.isLogLoading = false
      })
    },
    getDetailByLog() {
      this.isDetailLoading = true
      if (this.currentRequest != undefined) {
        this.currentRequest.abort()
      }
      var self = this
      // execute log request for first instance 
      this.currentRequest = $.ajax({
        url: '/log/' + this.filterLines + '/' + this.currentFileId,
        method: 'GET',
        crossDomain: true
      }).done(function (data) {
        self.detailStr = data.length > 0 ? data : 'Sin contenido'
        self.isDetailLoading = false
        self.scroll(false)
      }).fail(function (data) {
        if (data.statusText != 'abort') {
          self.isDetailLoading = false
        }
        self.detailStr(data.responseText)
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
    filterRequest() {
      if (this.filter.length == 0) {
        this.getInfo('')
        return
      }
      this.getInfo(this.filter)
    },
    onSubmit() {
      this.filterRequest()
    },
    clearFilter() {
      this.filter = ''
      this.filterRequest()
    },
    refresh() {
      if (this.filterType == 'custom') {
        if (this.filterLines < 1 || this.filterLines > this.maxLines) {
          this.filterLines = this.maxLines
        }
      }else {
        this.filterLines = this.maxLines
      }
      this.getDetailByLog()
    },
    zoomIn() {
      
      if (this.fontSize > this.minTextSize) {
        this.fontSize = this.fontSize - 1
      }
    },
    zoomOut() {
      if (this.fontSize < this.maxTextSize) {
        this.fontSize++
      }
    },
    scroller() {
      this.scroll(this.scrolled)
    }
  },
  computed: {
    scrolling() {
      return this.scrolled ? 'expand_less' : 'expand_more'
    },
    detail() {
      return this.isDetailLoading ? 'Cargando ...' : this.detailStr
    },
    textSizeStr() {
      return this.fontSize + 'px'
    },
    filterVisibility(){
      return this.filterType == 'custom'
    }

  },
  mounted() {
    this.getInfo('')

    var self = this
    $('#logText').scroll(function () {
      var offset = this.scrollHeight
      if ($('#logText').scrollTop() + $('#logText').height() >= (offset - 100)) {
        self.scrolled = true
      }else {
        self.scrolled = false
      }
    })
  }
})
