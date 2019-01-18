!function(){
  let $view = $(".svg-wrapper")
  let controller = {
    $view: null,
    init: function($view){
      this.$view = $view
      this.bindEvents()
    },
    bindEvents: function(){
      this.$view.on("click", e => {
        let index = this.$view.index(e.currentTarget);
        $("section").hide().eq(index).fadeIn();
        $(window).scrollTop(0)
      });
    }
  }
  controller.init.call(controller,$view) 
}.call()
