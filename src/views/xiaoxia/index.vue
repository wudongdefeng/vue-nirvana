<template>
  <div>
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      style="min-height: calc(100vh - 46px)"
    >
      <van-overlay class="loadingBox" :show="showOverlay">
        <van-loading size="24px">加载中...</van-loading>
      </van-overlay>
      <div class="hello">
        <div class="details">
          <span class="setting">
            <van-icon name="setting-o" size="20" />
          </span>
          <div class="box">
            <van-image round :src="mengmaindata.coverImageUrl" />
            <div class="detail">
              <h1>
                <span>{{ mengmaindata.title }}</span>
              </h1>
              <p>{{ mengmaindata.area }}</p>
              <p>{{ mengmaindata.updateTime }}</p>
            </div>
          </div>
        </div>
        <div class="selections">
          <van-cell title="选集" is-link @click="showPopup" />
          <div class="horizontal-container">
            <div class="scroll-wrapper" ref="episodesOuter">
              <div class="scroll-content">
                <van-button
                  round
                  v-for="(item, index) in [...episodes].splice(0, 10)"
                  :key="index"
                  class="scroll-item"
                  >{{ item.text }}</van-button
                >
              </div>
            </div>
          </div>
        </div>
        <van-collapse v-model="activeNames" accordion class="introduction">
          <van-collapse-item title="简介" name="1">{{
            mengmaindata.introduction
          }}</van-collapse-item>
        </van-collapse>
      </div>
    </van-pull-refresh>
    <van-popup
      v-model="show"
      round
      position="bottom"
      :style="{ height: '80vh' }"
      @close="closePop"
      @opened="openPop"
      :lock-scroll="false"
    >
      <van-dropdown-menu active-color="rgba(32, 18, 217, 255)">
        <van-dropdown-item
          @change="
            (value) => {
              currentPage = 1;
              episodes = allEpisodes[value];
            }
          "
          v-model="playSourceValue"
          :options="playSource"
        />
        <van-dropdown-item
          @change="
            (value) => {
              currentPage = 1;
            }
          "
          v-model="sortValue"
          :options="sort"
        />
      </van-dropdown-menu>
      <div class="core-container">
        <div class="scroll-wrapper" ref="episodes">
          <div class="scroll-content">
            <ul>
              <li
                v-for="(item, index) in sortValue
                  ? [...episodes].splice(
                      (currentPage - 1) * 50,
                      currentPage * 50
                    )
                  : [...episodes]
                      .reverse()
                      .splice((currentPage - 1) * 50, currentPage * 50)"
                :key="index"
              >
                <van-button round class="scroll-item">{{
                  item.text
                }}</van-button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <van-pagination
        v-model="currentPage"
        :total-items="24"
        :page-count="Math.ceil(episodes.length / 50)"
        :items-per-page="50"
      />
    </van-popup>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import { Toast, ImagePreview } from "vant";
import ScrollBar from "@better-scroll/scroll-bar";
import cheerio from "cheerio";
import axios from "axios";
import store from "@/store";

BScroll.use(ScrollBar);

export default {
  data() {
    return {
      allEpisodes: [],
      episodes: [],
      showOverlay: true,
      currentPage: 1,
      isHeaderVisible: false,
      playSourceValue: 0,
      playSource: [],
      sortValue: true,
      sort: [
        { text: "正序", value: true },
        { text: "倒序", value: false },
      ],
      isLoading: false,
      activeNames: "",
      show: false,
      mengmaindata: {
        title: "",
        introduction: "",
        coverImageUrl: "",
        updateTime: "",
        area: "",
      },
    };
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      await axios.get("/mengmian/view/30095").then((res) => {
        console.log(res.headers);
        const $ = cheerio.load(res.data);
        this.mengmaindata.title = $("h1.title").text();
        store.dispatch("bar/setTitle", "小虾 - " + this.mengmaindata.title);
        this.mengmaindata.updateTime = $(".data").eq(3).text();
        this.mengmaindata.area = $(".data").eq(0).text();
        this.mengmaindata.introduction = $(".detail-content").text();
        this.mengmaindata.coverImageUrl = $(".cover-image").attr("src");
        let $list = $(".nav-tabs li");
        let playSource = [];
        for (let i = 0; i < $list.length; i++) {
          playSource.push({
            text: $list.eq(i).text(),
            value: i,
          });
        }
        this.playSource = playSource;
        $list = $(".stui-content__playlist");
        let allEpisodes = [];
        for (let i = 0; i < $list.length; i++) {
          let $list2 = $list.eq(i).find("li");
          allEpisodes[i] = [];
          for (let j = 0; j < $list2.length; j++) {
            allEpisodes[i].push({
              text: $list2.eq(j).text(),
            });
          }
        }
        this.allEpisodes = allEpisodes;
        this.episodes = this.allEpisodes[this.playSourceValue];
        this.showOverlay = false;
      });
      this.init();
    },
    init() {
      this.episodesOuterBs = new BScroll(this.$refs.episodesOuter, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
      });
    },
    refresh() {
      this.episodesOuterBs.refresh();
    },
    onRefresh() {
      this.getData();
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
      }, 1000);
    },
    showImg() {
      ImagePreview([
        "https://img.yzcdn.cn/vant/apple-1.jpg",
        "https://img.yzcdn.cn/vant/apple-2.jpg",
      ]);
    },
    showPopup() {
      this.show = true;
    },
    closePop() {
      this.handleHambergerClick();
      this.init();
    },
    openPop() {
      this.handleHambergerClick();
      this.episodesOuterBs.destroy();
      if (!this.episodesBs)
        this.episodesBs = new BScroll(this.$refs.episodes, {
          scrollY: true,
          probeType: 3, // listening scroll hook
          click: true,
          scrollbar: true,
        });
    },
    handleHambergerClick() {
      // hack: 滑动穿透问题
      if (!this.isHeaderVisible) {
        this.lockBody();
      } else {
        this.resetBody();
      }

      this.isHeaderVisible = !this.isHeaderVisible;
    },
    lockBody() {
      const { body } = document;
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      body.style.position = "fixed";
      body.style.width = "100%";
      body.style.top = `-${scrollTop}px`;
    },
    resetBody() {
      const { body } = document;
      const { top } = body.style;
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
      document.body.scrollTop = -parseInt(top, 10);
      document.documentElement.scrollTop = -parseInt(top, 10);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../common/style/var";
.selections,
.introduction,
.details {
  margin: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
}
.details {
  .setting {
    position: absolute;
    right: 30px;
    cursor: pointer;
  }
  .box {
    display: table;
    .van-image {
      vertical-align: top;
      width: 8em;
      margin-right: 10px;
      border-radius: 8px;
    }
    .detail {
      display: table-cell;
      vertical-align: top;
    }
  }
}
.show {
  margin: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  .title {
    margin: 0;
    padding: 16px;
    color: @van-doc-text-light-blue;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }
}

.core-container {
  height: calc(80vh - 88px);
  .scroll-wrapper {
    position: relative;
    height: 100%;
    padding: 16px auto;
    border-radius: 5px;
    overflow: hidden;

    .scroll-content {
      display: inline-block;
      ul {
        width: 100vw;
        li {
          display: block;
          float: left;
          width: 25vw;
          text-align: center;
        }
      }
    }

    img {
      height: 100px;
    }

    .van-button {
      width: 4.3em;
      height: 2.1em;
      &__text {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .scroll-item {
      display: inline-block;
      text-align: center;
      margin: 10px;
      border-radius: 8px;
    }
  }
}

.horizontal-container {
  .scroll-wrapper {
    position: relative;
    width: 90%;
    margin: 10px auto;
    white-space: nowrap;
    border-radius: 5px;
    overflow: hidden;

    .scroll-content {
      display: inline-block;
    }

    img {
      height: 100px;
    }

    .van-button {
      width: 4.3em;
      height: 2.1em;
      &__text {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .scroll-item {
      display: inline-block;
      text-align: center;
      margin: 0 10px;
      border-radius: 8px;
    }
  }
}

.panel_hd {
  padding: 10px;
}

.loadingBox {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style>
.van-pagination__item {
  color: rgba(34, 34, 34, 255);
}
.van-pagination__item--active {
  color: #fff;
  background-color: rgba(32, 18, 217, 255);
}
.van-pagination__item:active {
  color: #fff;
  background-color: rgba(32, 18, 217, 255);
}
.van-button--default {
  /* color: rgba(34, 34, 34, 255);
  background-color: #fff;
  border: 2px solid rgba(34, 34, 34, 255); */
  color: rgba(0, 0, 0, 0.86);
  background-color: #f4f4f4;
  font-size: 14px;
  font-weight: 700;
}
</style>