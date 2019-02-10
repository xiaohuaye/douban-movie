!function() {
  let $view = $(".pag-USMovie");
  let model = {
    get: function() {
      return $.ajax({
        url: "https://api.douban.com/v2/movie/us_box",
        type: "GET",
        data: {
          start: this.index,
          count: 20
        },
        dataType: "jsonp"
      });
    }
  };
  let controller = {
    $view: null,
    model: null,
    index: null,
    init: function() {
      this.$view = $view;
      this.model = model;
      this.index = null;
      this.start();
    },
    start: function() {
      $(this.$view)
        .find(".loading>.icon")
        .removeClass("active")
        .addClass("active");
      let _this = this;
      this.model.get().then(
        function(ret) {
          _this.setData(ret);
          $(_this.$view).find(".loading>.icon").removeClass("active");
        },
        function() {
          $(_this.$view).find(".loading>.icon").removeClass("active");
        }
      );
    },
    fillDataText: function($node, selector, datas) {
      $node.find(selector).text(datas);
    },
    setData: function(data) {
      //生成模板
      data.subjects.forEach(movie => {
        let tpl = `
      <div class="introduce1">
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
        //填充数据
        let $node = $(tpl);
        $node.find("img").attr("src", movie.subject.images.medium);
        $node.find("a").attr("href", movie.subject.alt);
        this.fillDataText($node, "a", movie.subject.title);
        this.fillDataText($node, ".directors", () => {
          let dirArry = [];
          movie.subject.directors.forEach(dir => {
            dirArry.push(dir.name);
          });
          return "导演：" + dirArry.join("、");
        });
        this.fillDataText($node, ".casts", () => {
          let castArry = [];
          movie.subject.casts.forEach(cast => {
            castArry.push(cast.name);
          });
          return "演员：" + castArry.join("、");
        });
        this.fillDataText($node, ".number-movie", () => {
          return `${$(".introduce1").length + 1}`;

        });
        this.fillDataText($node, ".others", () => {
          let genresArry = [];
          movie.subject.genres.forEach(genres => {
            genresArry.push(genres);
          });
          return "2018 /" + genresArry.join(" / ");
        });
        this.fillDataText($node, ".collect", movie.subject.collect_count + "人收藏");
        this.fillDataText($node, ".evaluate", "评分 " + movie.subject.rating.average);
        //将模板插入页面中
        this.$view.find(".movie-wrapper")
          .eq(0)
          .append($node);
      });
    }
  };
  controller.init.call(controller, $view, model);
}.call();
