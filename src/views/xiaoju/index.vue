<template>
  <div>
    <van-overlay class="loadingBox" :show="showOverlay" :z-index="3001">
      <van-loading size="24px">加载中...</van-loading>
    </van-overlay>
    <div>
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        style="min-height: calc(100vh - 46px)"
      >
        <van-notice-bar
          mode="closeable"
          color="rgba(0, 0, 0, 0.86)"
          background="#fff"
          v-if="sequelTips.show"
        >
          <div
            @click="
              $nextTick(() => {
                playVideo(sequelTips.url, sequelTips.text);
              })
            "
            slot="default"
          >
            点击恢复到播放<span style="font-weight: 700">{{
              sequelTips.text
            }}</span
            >。
          </div>
        </van-notice-bar>
        <div class="details">
          <!-- <span class="setting">
            <van-icon name="setting-o" size="20" />
          </span> -->
          <div class="box">
            <div class="detail">
              <div class="header-title">
                <span class="title">{{ xiaojudata.title }}</span>
              </div>
              <div>
                <!-- <span class="subtitle-item">{{ mengmaindata.area }}</span>
                <span class="subtitle-item dot">{{
                  mengmaindata.updateTime
                }}</span> -->
                <van-tag
                  v-if="xiaojudata.tag"
                  color="rgba(153,153,153,.1)"
                  text-color="#999"
                  style="
                    vertical-align: middle;
                    margin-right: 6px;
                    margin-top: -2px;
                    font-weight: 700;
                  "
                  >{{ xiaojudata.tag }}</van-tag
                >
                <span
                  :class="index == 0 ? 'subtitle-item' : 'subtitle-item dot'"
                  v-for="(item, index) in subtitleArr"
                  :key="index"
                  >{{ item }}</span
                >
              </div>
              <div class="updateTime">
                <span>{{
                  xiaojudata.updateTime + " " + xiaojudata.updateProgress
                }}</span>
              </div>
              <!-- <div class="updateProgress">
                <span>{{ xiaojudata.updateProgress }}</span>
              </div> -->
            </div>
            <div class="pic">
              <div
                class="cover"
                :style="
                  'background-image: url(' + xiaojudata.coverImageUrl + ');'
                "
              />
            </div>
          </div>
        </div>
        <div class="selections" v-show="playShow">
          <van-cell title="选集" is-link @click="showPopup" />
          <div class="horizontal-container">
            <div
              class="scroll-wrapper"
              ref="episodesOuter"
              style="margin: 10px 16px 0px 16px"
            >
              <div class="scroll-content">
                <van-button
                  v-tooltip="item.text"
                  round
                  v-for="(item, index) in [...episodes].splice(0, 10)"
                  :key="index"
                  class="scroll-item selectionButton"
                  @click="
                    clarity.actions = item.data.map((e) => {
                      e.name = e.displayName;
                      e.text = item.episode;
                      return e;
                    });
                    clarity.show = true;
                  "
                  >{{ item.episode }}</van-button
                >
                <van-button
                  v-if="episodes.length > 10"
                  round
                  class="seeMore"
                  @click="showPopup"
                  >查看更多</van-button
                >
              </div>
            </div>
          </div>
        </div>
        <div class="acting">
          <h2 class="title">演职人员</h2>
          <div class="horizontal-container" style="padding-bottom: 0rem">
            <div class="scroll-wrapper" ref="acting">
              <div class="scroll-content">
                <div
                  v-for="(item, index) in xiaojudata.actingList"
                  :key="index"
                  class="scroll-item"
                  style="text-align: center"
                >
                  <div class="actingPic">
                    <div
                      :style="'background-image: url(' + item.avatar + ');'"
                      class="cover"
                    />
                  </div>
                  <div :key="index">
                    <div class="name">{{ item.name }}</div>
                    <div class="role">{{ item.role }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="show">
          <h2 class="title">预告片 / 剧照</h2>
          <div class="horizontal-container" style="padding-bottom: 0rem">
            <div class="scroll-wrapper" ref="stills">
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
            xiaojudata.introduction
          }}</van-collapse-item>
        </van-collapse>
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
                $nextTick(() => {
                  episodesBs.refresh();
                });
              }
            "
            v-model="playSourceValue"
            :options="playSource"
          />
          <van-dropdown-item
            @change="
              (value) => {
                currentPage = 1;
                $nextTick(() => {
                  episodesBs.refresh();
                });
              }
            "
            v-model="sortValue"
            :options="sort"
          />
          <van-dropdown-item
            @change="
              (value) => {
                currentPage = 1;
                $nextTick(() => {
                  episodesBs.refresh();
                });
              }
            "
            v-model="layout.value"
            :options="layout.options"
          />
        </van-dropdown-menu>
        <div class="core-container">
          <div class="scroll-wrapper" ref="episodes">
            <div class="scroll-content">
              <van-row>
                <van-col
                  :span="layout.value"
                  style="text-align: center"
                  v-for="(item, index) in sortValue
                    ? [...episodes].splice(
                        (currentPage - 1) * 40,
                        currentPage * 40
                      )
                    : [...episodes]
                        .reverse()
                        .splice((currentPage - 1) * 40, currentPage * 40)"
                  :key="index"
                >
                  <van-button
                    v-tooltip="item.text"
                    @click="
                      clarity.actions = item.data.map((e) => {
                        e.name = e.displayName;
                        e.text = item.episode;
                        return e;
                      });
                      clarity.show = true;
                    "
                    round
                    class="scroll-item selectionButton"
                    >{{ item.episode }}</van-button
                  >
                </van-col>
              </van-row>
            </div>
          </div>
        </div>
        <van-pagination
          v-model="currentPage"
          :total-items="24"
          :page-count="Math.ceil(episodes.length / 40)"
          :items-per-page="40"
          @change="
            $nextTick(() => {
              episodesBs.refresh();
            })
          "
        />
      </van-popup>
      <van-action-sheet
        v-model="clarity.show"
        :actions="clarity.actions"
        @select="clarityOnSelect"
      />
      <van-action-sheet
        :closeable="false"
        :title="playInterface.title"
        v-model="playInterface.show"
        :actions="playInterface.actions"
        @select="playInterfaceOnSelect"
      />
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import { Toast, ImagePreview } from "vant";
import ScrollBar from "@better-scroll/scroll-bar";
import axios from "axios";
import store from "@/store";
import { validatenull } from "@/utils/validate";
import moment from "moment";
import cheerio from "cheerio";
BScroll.use(ScrollBar);

export default {
  name: "xiaoju",
  data() {
    return {
      layout: {
        options: [
          { text: "4×10", value: 6 },
          { text: "2×20", value: 12 },
          { text: "1×40", value: 24 },
        ],
        value: 6,
      },
      clarity: {
        show: false,
        actions: [],
      },
      playInterface: {
        title: "",
        show: false,
        actions: [],
      },
      sequelTips: {
        show: false,
        text: "",
        url: "",
      },
      stillsList: [],
      playShow: true,
      detailsId: this.$route.params.id,
      allEpisodes: [],
      episodes: [],
      showOverlay: true,
      currentPage: 1,
      isHeaderVisible: false,
      playSourceValue: 0,
      playSource: [
        {
          text: "默认源",
          value: 0,
        },
      ],
      sortValue: true,
      sort: [
        { text: "升序", value: true },
        { text: "降序", value: false },
      ],
      isLoading: false,
      activeNames: "",
      show: false,
      subtitleArr: [],
      xiaojudata: {
        title: "",
        introduction: "",
        coverImageUrl: "",
        updateTime: "",
        area: "",
        updateProgress: "",
        actingList: [],
      },
    };
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  mounted() {
    this.$nextTick(() => {
      window.setTimeout(async () => {
        await this.getData();
      }, 1500);
    });
  },
  methods: {
    async playInterfaceOnSelect(item) {
      if (!item.title) this.playVideo(item.name, item.text);
    },
    async clarityOnSelect(item) {
      this.showOverlay = true;
      let xiaojuAxios = axios.create({
        timeout: 1500,
      });
      let number = 0;
      let playInterface = [];
      for (let i = 0; i < 30; i++) {
        xiaojuAxios
          .get(`https://ipfs${i}.365kqzs.cn:9081/ipfs/${item.hash}`)
          .then(() => {
            // number += 1;
            // playInterface.push({
            //   name: `https://ipfs${i}.365kqzs.cn:9081/ipfs/${item.hash}`,
            //   text: `${item.text} - ${item.name}`,
            // });
          })
          .catch((e) => {
            if (e.message == "timeout of 1500ms exceeded") {
              playInterface.push({
                name: `https://ipfs${i}.365kqzs.cn:9081/ipfs/${item.hash}`,
                text: `${item.text} - ${item.name}`,
              });
              number += 1;
            }
          });
      }
      window.setTimeout(() => {
        this.playInterface.title = `共${number}条可用播放链接`;
        this.playInterface.actions = playInterface;
        this.clarity.show = false;
        this.playInterface.show = true;
        this.showOverlay = false;
      }, 2000);
    },
    async getData() {
      let res = {};
      this.showOverlay = true;
      let data = {};
      if (window.fy_bridge_app) {
        // let xxObj = JSON.parse(window.request("hiker://files/xxFile", {}));
        // let cookieArr = xxObj.cookie;
        // cookieArr = JSON.parse(cookieArr);
        // let cookie = "";
        // cookieArr.forEach((c) => {
        //   cookie += c + ";";
        // });
        // res = await window.request(
        //   `https://api.simpleplay.cn/api/programmes/${this.detailsId}`,
        //   {
        //     headers: {
        //       "Device-ID": "1d4c5ece-f8f7-36f3-b8f4-55cba7d7c14c",
        //       "User-Agent": "Viewer/2.1.2",
        //     },
        //     method: "GET",
        //   }
        // );
        res = await window.request(
          `https://www.juhuitv.com/moviedetail/${this.detailsId}.html`,
          {}
        );
        const $ = cheerio.load(res);
        data = JSON.parse($("#__NEXT_DATA__").html()).props.pageProps.movieInfo;
        //data = JSON.parse(res).data.programme;
      } else {
        res = await axios({
          url: `/juhui/api/programmes/${this.detailsId}`,
          method: "get",
          headers: {
            "device-id": "1d4c5ece-f8f7-36f3-b8f4-55cba7d7c14c",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        data = res.data.data.programme;
      }
      this.xiaojudata.title = data.title;
      store.dispatch("bar/setTitle", this.xiaojudata.title + " - 小橘");
      this.xiaojudata.tag = data.category.name;
      this.subtitleArr = [data.location, ...data.tags];
      this.xiaojudata.updateTime =
        "更新：" + moment(data.updatedAt).format("YYYY-MM-DD");
      this.xiaojudata.updateProgress =
        data.resourceCount + "/" + data.episodesCount + "集";
      this.xiaojudata.introduction = data.summary;
      this.xiaojudata.coverImageUrl = data.verticalCover;
      this.xiaojudata.actingList = data.actors;
      this.stillsList = data.programmeImages;
      this.allEpisodes = [[...data.resources]];
      this.episodes = this.allEpisodes[this.playSourceValue];
      this.showOverlay = false;
      this.$nextTick(() => {
        this.init();
      });
    },
    init() {
      this.episodesOuterBs = new BScroll(this.$refs.episodesOuter, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
        eventPassthrough: "vertical",
      });
      this.stillsBs = new BScroll(this.$refs.stills, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
        eventPassthrough: "vertical",
      });
      this.actingBs = new BScroll(this.$refs.acting, {
        scrollX: true,
        probeType: 3, // listening scroll hook
        click: true,
        eventPassthrough: "vertical",
      });
      if (window.fy_bridge_app) {
        let history = window.request(
          "hiker://files/nirvana/nirvana_xj_history",
          {}
        );
        if (!validatenull(history)) {
          history = JSON.parse(history);
          history.forEach((h) => {
            if (h.id == this.detailsId) {
              this.sequelTips.text = h.text;
              this.sequelTips.url = h.url;
              this.sequelTips.show = true;
            }
          });
        }
      }
    },
    refresh() {
      this.episodesOuterBs.refresh();
      this.stillsBs.refresh();
    },
    showImg(index) {
      ImagePreview(this.stillsList, index);
    },
    onRefresh() {
      this.showOverlay = true;
      window.setTimeout(async () => {
        await this.getData();
        this.$nextTick(() => {
          Toast("刷新成功");
          this.isLoading = false;
        });
      }, 300);
    },
    showPopup() {
      this.show = true;
    },
    closePop() {
      this.handleHambergerClick();
      // this.init();
    },
    openPop() {
      this.handleHambergerClick();
      // this.episodesOuterBs.destroy();
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
    async playVideo(url, text) {
      if (window.fy_bridge_app) {
        let playUrl = url;
        let playUrlArr = [];
        let domain = `https://ipfs${
          playUrl.match(/ipfs(.*)\.365kqzs/)[1]
        }.365kqzs.cn:9081/ipfs/`;
        this.episodes.forEach((e) => {
          let isClarity = false;
          e.data.forEach((d) => {
            if (
              d.hash == playUrl.split("ipfs/")[1] &&
              text.split(" - ")[1] == d.displayName
            ) {
              isClarity = true;
              playUrlArr.push({
                title: this.xiaojudata.title + " - " + text,
                url: playUrl,
                use: true,
              });
            } else if (text.split(" - ")[1] == d.displayName) {
              isClarity = true;
              playUrlArr.push({
                title:
                  this.xiaojudata.title +
                  " - " +
                  e.episode +
                  " - " +
                  d.displayName,
                url: domain + d.hash,
                use: false,
              });
            }
          });
          if (!isClarity)
            playUrlArr.push({
              title:
                this.xiaojudata.title +
                " - " +
                e.episode +
                " - " +
                e.data[0].displayName,
              url: domain + e.data[0].hash,
              use: false,
            });
        });
        let history = await window.request(
          "hiker://files/nirvana/nirvana_xj_history",
          {}
        );
        if (validatenull(history)) history = [];
        else history = JSON.parse(history);
        history.forEach((h, index) => {
          if (h.id == this.detailsId) history.splice(index, 1);
        });
        history = [
          {
            id: this.detailsId,
            title: this.xiaojudata.title,
            url: url,
            text: text,
            img: this.xiaojudata.coverImageUrl,
            source: "涅槃.小橘",
            time: Math.round(new Date() / 1000),
            isPlayUrl: true,
            playUrlArr,
          },
          ...history,
        ];
        if (history.length > 100) history.splice(100, 1);
        history = JSON.stringify(history);
        window.fy_bridge_app.writeFile(
          "hiker://files/nirvana/nirvana_xj_history",
          history
        );

        this.$nextTick(() => {
          window.fy_bridge_app.playVideos(JSON.stringify(playUrlArr));
        });
      } else window.location.href = url;
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
  padding: 0.04rem 0.04rem;
}
.details {
  padding: 0.2rem 0.2rem;
  .setting {
    position: absolute;
    right: 30px;
    cursor: pointer;
  }
  .box {
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    .detail {
      .header-title {
        line-height: 30px;
        margin-bottom: 10px;
        .title {
          font-weight: 700;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.86);
        }
      }
      .subtitle-item {
        position: relative;
        margin-right: 12px;
        font-size: 12px;
        line-height: 16px;
      }
      .subtitle-item.dot:before {
        position: absolute;
        display: inline-block;
        content: "";
        width: 2px;
        height: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        background: rgba(0, 0, 0, 0.4);
        top: 6px;
        left: -8px;
      }
      .updateTime {
        margin-top: 14px;
        line-height: 1;
        font-size: 14px;
      }
      // .updateProgress {
      //   margin-top: 14px;
      //   line-height: 1;
      //   font-size: 14px;
      // }
      flex: 1;
      display: table-cell;
      vertical-align: top;
    }
    .pic {
      margin-left: 14px;
      display: block;
      width: 1.05rem;
      height: 1.4rem;
      -webkit-border-radius: 10px;
      border-radius: 10px;
      overflow: hidden;
      .cover {
        background-size: cover;
        background-position: 50% 20%;
        // vertical-align: top;
        width: 100%;
        height: 100%;
        // margin-right: 10px;
        // border-radius: 8px;
      }
    }
  }
}
.show {
  margin: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0.2rem 0.2rem;
  .title {
    margin: 0;
    color: @van-doc-text-light-blue;
    font-weight: normal;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
  }
}
.acting {
  margin: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0.2rem 0.2rem;
  .title {
    margin: 0;
    color: @van-doc-text-light-blue;
    font-weight: normal;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
  }
  .actingPic {
    margin: 0 auto;
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    .cover {
      background-size: cover;
      background-position: 50% 20%;
      // vertical-align: top;
      width: 100%;
      height: 100%;
      // margin-right: 10px;
      // border-radius: 8px;
    }
  }
  .name {
    margin-top: 2px;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.86);
    margin-bottom: 2px;
  }
  .role {
    font-size: 10px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.3);
  }
}

.core-container {
  height: calc(80vh - 88px);
  .scroll-wrapper {
    position: relative;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;

    // .scroll-content {
    //   display: inline-block;
    //   ul {
    //     width: 100vw;
    //     li {
    //       display: block;
    //       float: left;
    //       width: 25vw;
    //       text-align: center;
    //     }
    //   }
    // }

    .scroll-item.van-button {
      width: 80%;
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
      border-radius: 10px;
    }
  }
}

.horizontal-container {
  padding-bottom: 0.16rem;
  // touch-action: none;
  .scroll-wrapper {
    position: relative;
    // width: 90%;
    margin-top: 0.1rem;
    // margin: 10px auto;
    white-space: nowrap;
    border-radius: 5px;
    overflow: hidden;

    .scroll-content {
      display: inline-block;
    }

    img {
      height: 100px;
      border-radius: 10px;
    }

    .scroll-item.van-button {
      min-width: 4.8em;
      height: 2.1em;
      border-radius: 8px;
      &__text {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .scroll-item {
      display: inline-block;
      text-align: center;
      margin: 0 10px;
      // border-radius: 8px;
    }
    .seeMore.van-button {
      width: 6.3em;
      height: 2.1em;
      &__text {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .seeMore {
      display: inline-block;
      text-align: center;
      margin: 10px;
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
.van-button__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selectionButton.van-button--default {
  /* color: rgba(34, 34, 34, 255);
  background-color: #fff;
  border: 2px solid rgba(34, 34, 34, 255); */
  color: rgba(0, 0, 0, 0.86);
  background-color: #f4f4f4;
  font-size: 14px;
  font-weight: 700;
}
.seeMore.van-button--default {
  /* color: rgba(34, 34, 34, 255);
  background-color: #fff;
  border: 2px solid rgba(34, 34, 34, 255); */
  color: #fff;
  background-color: rgba(32, 18, 217, 255);
  font-size: 14px;
  font-weight: 700;
}
.van-action-sheet__item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.van-action-sheet__header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}
</style>