Vue.config.devtools = true
var app = new Vue({
  el: '#app',
  data: {
    users:[]
  },
  methods: {
    select: function(event,index) {
      targetId = event.currentTarget.id;
      console.log(index); 
      $.ajax({
        url: '/proveedor/'+index,
        method: 'GET',
        crossDomain: true
      }).done(function (data) {

        console.log(data)
       

      }).fail(function (data) {
        console.log(data)

      })
    },
   getUsers(){
    var self = this;
    $.ajax({
        url: '/proveedor',
        method: 'GET',
        crossDomain: true
      }).done(function (data) {
        self.users = data;
        console.log(data)
       

      }).fail(function (data) {
        console.log(data)

      })
   }
  },
  computed: {

    
  },
  mounted() {
    this.getUsers();
  }
})
