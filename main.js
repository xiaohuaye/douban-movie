$(".svg-wrapper").on("click", e => {
  let index = $(".svg-wrapper").index(e.currentTarget);
  $("section")
    .hide()
    .eq(index)
    .fadeIn();
});
var index = null;
$.ajax({
  url: "https://api.douban.com/v2/movie/top250",
  type: "GET",
  data: {
    start: index,
    count: 20
  },
  dataType: "jsonp"
}).then(
  function(ret) {
    console.log(ret);
    setData(ret);
    index += 20;
  },
  function() {
    console.log("error");
  }
);

function setData(data) {
  data.subjects.forEach(movie => {
    let tpl = `
    <div class="introduce">
      <span class="number-movie">1</span>
      <img src="" alt="" width="100" height="148">
      <span class="extra">
        <a href=""></a>
        <p class='directors'></p>
        <p class='casts'></p>
        <p class="evaluate"></p>
        <p class="others"></p>
        <p class="collect"></p>
      </span>
    </div>
    `;

    let $node = $(tpl);
    $node.find("img").attr("src", movie.images.medium);
    $node.find("a").attr("href", movie.alt);
    $node.find("a").text(movie.title);
    $node.find(".directors").text(() => {
      let dirArry = [];
      movie.directors.forEach(dir => {
        dirArry.push(dir.name);
      });
      return "导演：" + dirArry.join("、");
    });
    $node.find(".casts").text(() => {
      let castArry = [];
      movie.casts.forEach(cast => {
        castArry.push(cast.name);
      });
      return "演员：" + castArry.join("、");
    });
    $node.find(".number-movie").text(function() {
      return `${$(".introduce").length + 1}`;
    });
    $node.find(".others").text(function() {
      let genresArry = [];
      movie.genres.forEach(genres => {
        genresArry.push(genres);
      });
      return movie.year + " / " + genresArry.join(" / ");
    });
    $node.find(".collect").text(movie.collect_count + "人收藏");
    $node.find(".evaluate").text("评分 " + movie.rating.average);

    $("section")
      .eq(0)
      .append($node);
  });
}
$(window).scroll(function() {
  let scrollTop = $(this).scrollTop();
  let scrollHeight = $(document).height();
  let windowHeight = $(this).height();
  if (scrollTop + windowHeight > scrollHeight - 1) {
    $.ajax({
      url: "https://api.douban.com/v2/movie/top250",
      type: "GET",
      data: {
        start: index,
        count: 20
      },
      dataType: "jsonp"
    }).then(
      function(ret) {
        console.log(ret);
        setData(ret);
        index += 20;
      },
      function() {
        console.log("error");
      }
    );
  }
});
