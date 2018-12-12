$(".svg-wrapper").on("click", e => {
  let index = $(".svg-wrapper").index(e.currentTarget);
  $("section")
    .hide()
    .eq(index)
    .fadeIn();
});

$.ajax({
  url: "https://api.douban.com/v2/movie/top250",
  type: "GET",
  data: {
    start: 0,
    count: 20
  },
  dataType: "jsonp"
}).then(
  function(ret) {
    console.log(ret);
  },
  function() {
    console.log("error");
  }
);
