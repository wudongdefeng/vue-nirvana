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
            <van-image @click="showImg" round :src="mengmaindata.coverImageUrl" />
            <div class="detail">
              <span>{{ mengmaindata.title }}</span>
              <br />
              <br />
              <span>Coco</span>
              <br />
              <br />
              <span>美国 / 喜剧 / 动画 / 奇幻 / 2017-11-24(中国大陆)上映 / 片长105分钟</span>
            </div>
          </div>
        </div>
        <div class="selections">
          <van-cell title="选集" is-link @click="showPopup" />
          <div class="horizontal-container">
            <div class="scroll-wrapper" ref="selections">
              <div class="scroll-content">
                <van-button
                  round
                  color="linear-gradient(to right, #4bb0ff, #6149f6)"
                  v-for="i in 10"
                  :key="i"
                  class="scroll-item"
                >1</van-button>
              </div>
            </div>
          </div>
        </div>
        <div class="show">
          <h2 class="title">预告片 / 剧照</h2>
          <div class="horizontal-container">
            <div class="scroll-wrapper" ref="scroll">
              <div class="scroll-content">
                <img
                  v-for="i in 10"
                  :key="i"
                  src="https://img9.doubanio.com/view/photo/l/public/p2505709314.webp"
                  class="scroll-item"
                  @load="refresh"
                  @click="showImg"
                />
              </div>
            </div>
          </div>
        </div>
        <van-collapse v-model="activeNames" accordion class="introduction">
          <van-collapse-item title="简介" name="1">{{ mengmaindata.introduction }}</van-collapse-item>
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
      <van-dropdown-menu>
        <van-dropdown-item v-model="value1" :options="option1" />
        <van-dropdown-item v-model="value2" :options="option2" />
      </van-dropdown-menu>
      <div class="core-container">
        <div class="scroll-wrapper" ref="line2">
          <div class="scroll-content">
            <ul>
              <li v-for="i in 50" :key="i">
                <van-button
                  round
                  color="linear-gradient(to right, #4bb0ff, #6149f6)"
                  class="scroll-item"
                >1</van-button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <van-pagination v-model="currentPage" :total-items="24" :items-per-page="5" />
    </van-popup>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import { Toast, ImagePreview } from "vant";
import ScrollBar from "@better-scroll/scroll-bar";
import cheerio from "cheerio";
import axios from "axios";

BScroll.use(ScrollBar);

export default {
  data() {
    return {
      showOverlay: true,
      currentPage: 1,
      isHeaderVisible: false,
      value1: 0,
      value2: "a",
      option1: [
        { text: "全部商品", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 },
      ],
      option2: [
        { text: "默认排序", value: "a" },
        { text: "好评排序", value: "b" },
        { text: "销量排序", value: "c" },
      ],
      isLoading: false,
      activeNames: "",
      show: false,
      mengmaindata: {
        title: "",
        introduction: "",
        coverImageUrl: "",
      },
    };
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  mounted() {
    this.$nextTick(() => this.init());
    this.getData();
  },
  methods: {
    getData() {
      axios.defaults.withCredentials = true;
      axios.get("/mengmian/view/29692").then((res) => {
        console.log(res.headers);
        const $ = cheerio.load(res.data);
        this.mengmaindata.title = $("h1.title").text();
        this.mengmaindata.introduction = $(".detail-sketch").text();
        this.mengmaindata.coverImageUrl = $(".cover-image").attr("src");
        this.showOverlay = false;
      });
      axios({
        url: "/juhui/api/programmes?search=&sort=match&page=0&limit=20",
        method: "get",
        headers: {
          "device-id": "1d4c5ece-f8f7-36f3-b8f4-55cba7d7c14c",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
      });
      this.bs2 = new BScroll(this.$refs.selections, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
      });
    },
    refresh() {
      this.bs.refresh();
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
      this.bs.destroy();
      this.bs2.destroy();
      if (!this.bs4)
        this.bs4 = new BScroll(this.$refs.line2, {
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
@import "../common/style/var";
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