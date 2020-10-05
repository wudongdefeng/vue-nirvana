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
              showOverlay = true;
              $nextTick(() => {
                playVideo(sequelTips.url, sequelTips.text);
              });
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
                <span class="title">{{ mengmaindata.title }}</span>
              </div>
              <div>
                <!-- <span class="subtitle-item">{{ mengmaindata.area }}</span>
                <span class="subtitle-item dot">{{
                  mengmaindata.updateTime
                }}</span> -->
                <span
                  :class="index == 0 ? 'subtitle-item' : 'subtitle-item dot'"
                  v-for="(item, index) in subtitleArr"
                  :key="index"
                  >{{ item }}</span
                >
              </div>
              <div class="updateTime">
                <span>{{ mengmaindata.updateTime }}</span>
              </div>
            </div>
            <div class="pic">
              <div
                class="cover"
                :style="
                  'background-image: url(' + mengmaindata.coverImageUrl + ');'
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
                  round
                  v-tooltip="item.text"
                  v-for="(item, index) in [...episodes].splice(0, 10)"
                  :key="index"
                  class="scroll-item selectionButton"
                  @click="
                    showOverlay = true;
                    $nextTick(() => {
                      playVideo(item.url, item.text);
                    });
                  "
                  >{{ item.text }}</van-button
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
        <van-collapse v-model="activeNames" accordion class="introduction">
          <van-collapse-item title="简介" name="1">{{
            mengmaindata.introduction
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
                      showOverlay = true;
                      $nextTick(() => {
                        playVideo(item.url, item.text);
                      });
                    "
                    round
                    class="scroll-item selectionButton"
                    >{{ item.text }}</van-button
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
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import { Toast, ImagePreview } from "vant";
import ScrollBar from "@better-scroll/scroll-bar";
import cheerio from "cheerio";
import axios from "axios";
import store from "@/store";
import CryptoJS from "crypto-js";
import pako from "pako";
import { validatenull } from "@/utils/validate";

BScroll.use(ScrollBar);

export default {
  name: "xiaoxia",
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
      sequelTips: {
        show: false,
        text: "",
        url: "",
      },
      playShow: true,
      detailsId: this.$route.params.id,
      allEpisodes: [],
      episodes: [],
      showOverlay: true,
      currentPage: 1,
      isHeaderVisible: false,
      playSourceValue: 0,
      playSource: [],
      sortValue: true,
      sort: [
        { text: "升序", value: true },
        { text: "降序", value: false },
      ],
      isLoading: false,
      activeNames: "",
      show: false,
      subtitleArr: [],
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
    if (this.$route.params.id)
      this.$nextTick(() => {
        window.setTimeout(async () => {
          await this.getData();
        }, 300);
        this.$nextTick(() => {
          if (this.$route.params.playCoding) {
            let playCoding = CryptoJS.enc.Base64.parse(
              this.$route.params.playCoding
            );
            playCoding = playCoding.toString(CryptoJS.enc.Utf8);
            let playObj = JSON.parse(playCoding);
            this.$router.push({ path: `/xiaoxia/${this.$route.params.id}` });
            window.setTimeout(async () => {
              this.showOverlay = true;
              this.playVideo(playObj.url, playObj.text);
            }, 800);
          }
        });
      });
  },
  methods: {
    async getData() {
      let res = {};
      this.showOverlay = true;
      let $ = "";
      if (window.fy_bridge_app) {
        // let xxObj = JSON.parse(window.request("hiker://files/xxFile", {}));
        // let cookieArr = xxObj.cookie;
        // cookieArr = JSON.parse(cookieArr);
        // let cookie = "";
        // cookieArr.forEach((c) => {
        //   cookie += c + ";";
        // });
        res = await window.request(
          `https://mengmiandaxia.com/view/${this.detailsId}`
        );
        $ = cheerio.load(res);
      } else {
        res = await axios.get(`/mengmian/view/${this.detailsId}`);
        $ = cheerio.load(res.data);
      }
      this.mengmaindata.title = $("h1.title")
        .clone() //复制元素
        .children() //获取所有子元素
        .remove() //删除所有子元素
        .end() //回到选择的元素
        .text();
      store.dispatch("bar/setTitle", this.mengmaindata.title + " - 小虾");
      this.mengmaindata.updateTime = $(".data").eq(3).text();
      // this.mengmaindata.area = $(".data").eq(0).text();
      let subtitleArr = [];
      let $list = $(".tag-list a");
      for (let i = 0; i < $list.length; i++) {
        subtitleArr.push($list.eq(i).text());
      }
      // $list = $(".data").eq(0).find("a");
      // for (let i = 0; i < $list.length; i++) {
      //   subtitleArr.push($list.eq(i).text());
      // }
      // subtitleArr.push($(".data").eq(3).text());
      this.subtitleArr = subtitleArr;
      this.mengmaindata.introduction = $(".detail-content").text();
      this.mengmaindata.coverImageUrl = $(".cover-image").attr("src");
      if ($(".nav-tabs li").length > 0) {
        $list = $(".nav-tabs li");
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
              url: $list2.eq(j).find("a").attr("href"),
            });
          }
        }
        this.playShow = true;
        this.allEpisodes = allEpisodes;
        this.episodes = this.allEpisodes[this.playSourceValue];
      } else {
        this.playShow = false;
      }
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
      if (window.fy_bridge_app) {
        let history = window.request(
          "hiker://files/nirvana/nirvana_xx_history",
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
    },
    onRefresh() {
      this.showOverlay = true;
      window.setTimeout(async () => {
        await this.getData();
        this.$nextTick(() => {
          Toast("刷新成功");
          this.isLoading = false;
        });
      }, 10);
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
      window.setTimeout(async () => {
        if (window.fy_bridge_app) {
          let history = await window.request(
            "hiker://files/nirvana/nirvana_xx_history",
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
              title: this.mengmaindata.title.trim(),
              url: url,
              text: text.trim(),
              img: this.mengmaindata.coverImageUrl,
              source: "涅槃.小虾",
              time: Math.round(new Date() / 1000),
              isPlayUrl: false,
            },
            ...history,
          ];
          if (history.length > 100) history.splice(100, 1);
          history = JSON.stringify(history);
          window.fy_bridge_app.writeFile(
            "hiker://files/nirvana/nirvana_xx_history",
            history
          );
          let xxObj = JSON.parse(
            window.request("hiker://files/nirvana/nirvana_xxFile", {})
          );
          let token = xxObj.token;
          let cookieArr = xxObj.cookie;
          cookieArr = JSON.parse(cookieArr);
          let cookie = "";
          cookieArr.forEach((c) => {
            cookie += c + ";";
          });
          let res = await window.request(url);
          const $ = cheerio.load(res);
          let hash = CryptoJS.MD5(
            $("#show").attr("data-cv") + "|mengmiandaxia"
          );
          let id = $("#show").attr("data-ck");
          let data = await window.request(
            "https://mengmiandaxia.com/cloud.html",
            {
              headers: {
                cookie: cookie,
              },
              method: "POST",
              body: `_hash=${hash}&id=${id}&_token=${token}`,
            }
          );
          data = JSON.parse(data);
          let playUrl = pako.inflate(atob(data.url), { to: "string" });
          let playUrlArr = [];
          let hikerCustomizeMethods = `eval(fetch("https://cdn.jsdelivr.net/npm/pako@1.0.11/dist/pako.min.js",{}));eval(getCryptoJS());var base64={};base64.PADCHAR="=";base64.ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";base64.makeDOMException=function(){var e,tmp;try{return new DOMException(DOMException.INVALID_CHARACTER_ERR)}catch(tmp){var ex=new Error("DOM Exception 5");ex.code=ex.number=5;ex.name=ex.description="INVALID_CHARACTER_ERR";ex.toString=function(){return"Error: "+ex.name+": "+ex.message};return ex}};base64.getbyte64=function(s,i){var idx=base64.ALPHA.indexOf(s.charAt(i));if(idx===-1){throw base64.makeDOMException()}return idx};base64.decode=function(s){s=""+s;var getbyte64=base64.getbyte64;var pads,i,b10;var imax=s.length;if(imax===0){return s}if(imax%4!==0){throw base64.makeDOMException()}pads=0;if(s.charAt(imax-1)===base64.PADCHAR){pads=1;if(s.charAt(imax-2)===base64.PADCHAR){pads=2}imax-=4}var x=[];for(i=0;i<imax;i+=4){b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12)|(getbyte64(s,i+2)<<6)|getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&255,b10&255))}switch(pads){case 1:b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12)|(getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&255));break;case 2:b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break}return x.join("")};base64.getbyte=function(s,i){var x=s.charCodeAt(i);if(x>255){throw base64.makeDOMException()}return x};base64.encode=function(s){if(arguments.length!==1){throw new SyntaxError("Not enough arguments")}var padchar=base64.PADCHAR;var alpha=base64.ALPHA;var getbyte=base64.getbyte;var i,b10;var x=[];s=""+s;var imax=s.length-s.length%3;if(s.length===0){return s}for(i=0;i<imax;i+=3){b10=(getbyte(s,i)<<16)|(getbyte(s,i+1)<<8)|getbyte(s,i+2);x.push(alpha.charAt(b10>>18));x.push(alpha.charAt((b10>>12)&63));x.push(alpha.charAt((b10>>6)&63));x.push(alpha.charAt(b10&63))}switch(s.length-imax){case 1:b10=getbyte(s,i)<<16;x.push(alpha.charAt(b10>>18)+alpha.charAt((b10>>12)&63)+padchar+padchar);break;case 2:b10=(getbyte(s,i)<<16)|(getbyte(s,i+1)<<8);x.push(alpha.charAt(b10>>18)+alpha.charAt((b10>>12)&63)+alpha.charAt((b10>>6)&63)+padchar);break}return x.join("")};function unzip(b64Data){var data="";var strData=base64.decode(b64Data);data=pako.inflate(strData,{to:"string"});return data};`;
          this.episodes.forEach((e) => {
            let hikerRequestMethods = `let url="${e.url}";let res=fetch(url,{});let hash=CryptoJS.MD5(parseDomForHtml(res,"#show&&data-cv")+"|mengmiandaxia");let id=parseDomForHtml(res,"#show&&data-ck");let data=fetch("https://mengmiandaxia.com/cloud.html",{headers:{cookie:"${cookie}",},method:"POST",body:"_hash="+hash+"&id="+id+"&_token=${token}",});data=JSON.parse(data);`;
            let hikerHistoryMethods = `let history=fetch("hiker://files/nirvana/nirvana_xx_history",{});if(history=='null'||history==null||history=='undefined'||history==undefined||history=='')history=[];else history=JSON.parse(history);history.forEach((h,index)=>{if(h.id=="${
              this.detailsId
            }")history.splice(index,1)});history.unshift({id:"${
              this.detailsId
            }",title:"${this.mengmaindata.title.trim()}",url:"${
              e.url
            }",text:"${e.text.trim()}",img:"${
              this.mengmaindata.coverImageUrl
            }",source:"涅槃.小虾",time:Math.round(new Date()/1000),isPlayUrl:false,});if(history.length>100)history.splice(100,1);history=JSON.stringify(history);writeFile("hiker://files/nirvana/nirvana_xx_history",history);`;
            if (e.text.trim() == text.trim()) {
              playUrlArr.push({
                title: this.mengmaindata.title.trim() + " - " + e.text.trim(),
                url:
                  playUrl +
                  ";{User-Agent@Mozilla/5.0 (Linux；； Android 10；； M2006J10C Build/QP1A.190711.020；； wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.120 Mobile Safari/537.36&&Referer@https://www.mengmiandaxia.com}",
                use: true,
                codeAndHeader: ";get",
              });
            } else {
              playUrlArr.push({
                title: this.mengmaindata.title.trim() + " - " + e.text.trim(),
                use: false,
                originalUrl: `hiker://empty@lazyRule=.js:${hikerCustomizeMethods}${hikerRequestMethods}${hikerHistoryMethods}unzip(data.url)+";{User-Agent@Mozilla/5.0 (Linux*#*# Android 10*#*# M2006J10C Build/QP1A.190711.020*#*# wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.120 Mobile Safari/537.36.js:input.replace('*#','；')&&Referer@https://www.mengmiandaxia.com}";`,
                codeAndHeader: ";get",
              });
            }
          });
          window.fy_bridge_app.playVideos(JSON.stringify(playUrlArr));
          this.showOverlay = false;
        } else window.location.href = url;
      }, 300);
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
    //       // width: 25vw;
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
      border-radius: 8px;
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
    }

    .scroll-item.van-button {
      min-width: 4.8em;
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
</style>