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
              <span>{{ mengmaindata.title }}</span>
              <br />
              <br />
              <span>Coco</span>
              <br />
              <br />
              <span>{{ mengmaindata.tag }}</span>
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
                  color="#7232dd"
                  plain
                  v-for="(episode, index) in limitedEpisodeList"
                  :key="index"
                  class="scroll-item"
                >
                  <span>{{ episode.episode }}</span>
                </van-button>
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
                  v-for="(stills, index) in stillsList"
                  :key="index"
                  :src="stills"
                  class="scroll-item"
                  @load="refresh"
                  @click="showImg(index)"
                />
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
      <van-dropdown-menu>
        <van-dropdown-item v-model="value1" :options="option1" />
        <van-dropdown-item v-model="value2" :options="option2" />
      </van-dropdown-menu>
      <div class="core-container">
        <div class="scroll-wrapper" ref="line2">
          <div class="scroll-content">
            <ul>
              <li v-for="(episode, index) in episodeList" :key="index">
                <van-button round class="scroll-item">
                  <span>{{ episode.episode }}</span>
                </van-button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <van-pagination
        v-model="currentPage"
        :total-items="24"
        :items-per-page="5"
      />
    </van-popup>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import { Toast, ImagePreview } from "vant";
import ScrollBar from "@better-scroll/scroll-bar";
// import cheerio from "cheerio";
import axios from "axios";
import AES from "@/utils/AES.js";

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
        tag: "",
      },
      stillsList: [],
      episodeList: [],
      limitedEpisodeList: [],
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
      //   if (window.requestAsync)
      //     window.requestAsync(
      //       "https://api.simpleplay.cn/api/programmes/5f58b6ffe76fe4003ad929b0?origin=home",
      //       {
      //         headers: {
      //           "content-type": "application/x-www-form-urlencoded",
      //           "Client-Type": "app",
      //           "Device-ID": "1d4c5ece-f8f7-36f3-b8f4-55cba7d7c14c",
      //           "User-Agent": "Viewer/2.1.2 Android/5.1.1 Pad/OnePlus-HD1910",
      //           "serial-number": "ff859e60f71960e31c338386c8560e4a",
      //           timestamp: "1599744152827",
      //         },
      //         method: "GET",
      //       },
      //       (key, result) => {
      //         console.log(Date.now());
      //         console.log(result);
      //       }
      //     );

      var encrypts = AES.encrypt(
        JSON.stringify({ keywords: "花木兰", order_val: 1 })
      );
      console.log("getData -> encrypts", encrypts);
      var dess = AES.nanguadecrypt(
        "C94E36E1C184441968FFA4A1DAC51B5E1E907FDCC363E5B408600F99DC609C4AFC1CE1BD7A57B84BD940C00EA11FF30E011A108E24C29FFB65B7300CD7F5A09C9A8D97B20DE6840FCF037DF45C487717F349CA77B94717BD678BACC81F786F8F39ED00146383A550C6C5AF3094F1294727FE4102F8FF6A2E5875A6612FB16BF1B75B131CB07ADFC35342887FDD607532B104DEE9A7F9BA3DFEDEC52E4416B47C"
      );
      console.log("getData -> dess", dess);
      axios({
        url: "/nangua/App/UserInfo/indexPlay",
        method: "post",
        // data: {
        //   token: "64504f9cd1bcc3f8548c91aa7f035670",
        //   token_id: "38358672",
        //   phone_type: 1,
        //   versions_code: 1381,
        //   request_key:
        //     "9394019C2651FCCD9D2C97D903E34207207E963FFEFB4C5B4A76D773540B48098EBE2C46F7A720D6E9301B104604C48B",
        //   app_id: 1,
        //   ad_version: 1,
        // },
        data: `token=5b9ea09ec33f3dfa195c3671dd039854&token_id=10412632&phone_type=1&versions_code=1231&request_key=${AES.encrypt(
          JSON.stringify({
            token_id: "38358672",
            mobile_key: "b8d6cd3de363c0595322bec64e157d7d",
            vod_id: "149681",
            mobile_time: "1600953373",
            token: "64504f9cd1bcc3f8548c91aa7f035670",
          })
        )}&app_id=2&ad_version=1`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        console.log(res);
        let data = JSON.parse(AES.nanguadecrypt(res.data.data.response_key));
        console.log("getData -> data", data);
        // let data = res.data.data.programme;
        // let classifications = [...data.classifications];
        // let tag = "";
        // classifications.forEach((element, index) => {
        //   tag += element;
        //   if (index + 1 != classifications.length) tag += " / ";
        // });
        // tag +=
        //   " / " +
        //   data.releaseYear +
        //   "(" +
        //   data.location +
        //   ") / " +
        //   data.category.name;
        // this.mengmaindata.tag = tag;
        // this.mengmaindata.title = data.title;
        // this.mengmaindata.introduction = data.summary;
        // this.mengmaindata.coverImageUrl = data.verticalCover;
        // this.stillsList = data.programmeImages;
        // this.episodeList = data.resources;
        // [...this.episodeList].forEach((element, index) => {
        //   if (index < 10) {
        //     this.limitedEpisodeList.push(element);
        //   }
        // });
        // this.$nextTick(() => {
        //   this.bs2.refresh();
        //   this.showOverlay = false;
        // });
      });
    },
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
        eventPassthrough: "vertical",
      });
      this.bs2 = new BScroll(this.$refs.selections, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
        eventPassthrough: "vertical",
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
    showImg(index) {
      ImagePreview(this.stillsList, index);
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