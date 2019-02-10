!function() {
  let $view = $(".pag-seach");
  let model = {
    get: function(keyword, index) {
      return $.ajax({
        url: "https://api.douban.com/v2/movie/search",
        type: "GET",
        data: {
          start: index,
          count: 20,
          q: keyword
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
    keyword: null,
    num: null,
    init: function() {
      this.$view = $view;
      this.model = model;
      this.loading = false;
      this.index = null;
      this.keyword = null;
      this.num = 0;
      this.bindEvent();
    },
    fillDataText: function($node, selector, datas) {
      $node.find(selector).text(datas);
    },
    findSource: function() {
      $(this.$view)
        .find(".loading>.icon")
        .removeClass("active")
        .addClass("active");
      this.search(this.index);
    },
    bindEvent: function() {
      let _this = this;
      //当滚动条到底端时发送请求
      $(window).scroll(function() {
        let scrollTop = $(this).scrollTop();
        let scrollHeight = $(document).height();
        let windowHeight = $(this).height();
        if (scrollTop + windowHeight > scrollHeight - 10) {
          //判断是否在当前页面触发事件
          if ($(".pag-seach").css("display") !== "none") {
            if (_this.loading === false) {
              _this.loading = true;
              _this.findSource();
            }
          }
        }
      });
      $view.find("form").submit(e => {
        e.preventDefault();
        let historyArry = [];
        this.keyword = $view.find("form>input").val();
        historyArry[this.num] = this.keyword;
        //判断是否关键字改变
        if (this.num === 0) {
          if (this.loading === false) {
            this.loading = true;
            this.findSource();
          }
        } else {
          this.$view
            .find(".movie-wrapper")
            .eq(0)
            .empty();
          this.index = 0;
          if (this.loading === false) {
            this.loading = true;
            this.findSource();
          }
        }
        this.num += 1;
      });
      $view.find("form>.icon").click(e => {
        e.preventDefault();
        //判断是否关键字改变
        let historyArry = [];
        this.keyword = $view.find("form>input").val();
        historyArry[this.num] = this.keyword;
        if (this.num === 0) {
          this.findSource.call(controller);
        } else {
          this.$view
            .find(".movie-wrapper")
            .eq(0)
            .empty();
          this.index = 0;
          this.findSource.call(controller);
        }
        this.num += 1;
      });
    },
    search: function() {
      let _this = this;
      this.model.get(this.keyword, this.index).then(
        function(ret) {
          _this.setData(ret);
          _this.index += 20;
          _this.loading = false;
          $(".loading>.icon").removeClass("active");
        },
        function() {
          _this.loading = false;
          $(".loading>.icon").removeClass("active");
        }
      );
    },
    setData: function(data) {
      //生成模板
      data.subjects.forEach(movie => {
        let tpl = `
      <div class="introduce3">
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
          return `${$(".introduce3").length + 1}`;
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
    }
  };

  controller.init.call(controller, $view, model);
}.call();
