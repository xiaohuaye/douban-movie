!function() {
  let $view = $(".pag-rank");
  let model = {
    get: function(index) {
      return $.ajax({
        url: "https://api.douban.com/v2/movie/top250",
        type: "GET",
        data: {
          start: index,
          count: 20
        },
        dataType: "jsonp"
      });
    }
  };
  let controller = {
    $view: null,
    model: null,
    loading: null,
    index: null,
    init: function() {
      this.$view = $view;
      this.model = model;
      this.loading = false;
      this.index = null;
      this.start();
      this.bindEvent();
    },
    start: function() {
      $(this.$view)
        .find(".loading>.icon")
        .removeClass("active")
        .addClass("active");
      let _this = this;
      this.model.get(this.index).then(
        function(ret) {
          console.log(ret);
          _this.setData(ret);
          _this.index += 20;
          _this.loading = false;
          $(".loading>.icon").removeClass("active");
        },
        function() {
          console.log("error");
          _this.loading = false;
          $(".loading>.icon").removeClass("active");
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
        //填充数据
        let $node = $(tpl);
        $node.find("img").attr("src", movie.images.medium);
        $node.find("a").attr("href", movie.alt);
        this.fillDataText($node, "a", movie.title);
        this.fillDataText($node, ".directors", () => {
          let dirArry = [];
          movie.directors.forEach(dir => {
            dirArry.push(dir.name);
          });
          return "导演：" + dirArry.join("、");
        });
        this.fillDataText($node, ".casts", () => {
          let castArry = [];
          movie.casts.forEach(cast => {
            castArry.push(cast.name);
          });
          return "演员：" + castArry.join("、");
        });
        this.fillDataText($node, ".number-movie", () => {
          return `${$(".introduce").length + 1}`;
        });
        this.fillDataText($node, ".others", () => {
          let genresArry = [];
          movie.genres.forEach(genres => {
            genresArry.push(genres);
          });
          return movie.year + " / " + genresArry.join(" / ");
        });
        this.fillDataText($node, ".collect", movie.collect_count + "人收藏");
        this.fillDataText($node, ".evaluate", "评分 " + movie.rating.average);
        //将模板插入页面中
        this.$view
          .find(".movie-wrapper")
          .eq(0)
          .append($node);
      });
    },
    bindEvent: function() {
      let _this = this;
      //当滚动条到底端时发送请求
      $(window).scroll(function() {
        let scrollTop = $(this).scrollTop();
        let scrollHeight = $(document).height();
        let windowHeight = $(this).height();
        if (scrollTop + windowHeight > scrollHeight - 10) {
          if ($(".pag-rank").css("display") !== "none") {
            if (_this.loading === false) {
              _this.loading = true;
              _this.start();
            }
          }
        }
      });
    }
  };
  controller.init.call(controller, $view, model);
}.call();
