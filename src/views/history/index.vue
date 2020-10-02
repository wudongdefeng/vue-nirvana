<template>
  <div id="history">
    <van-overlay class="loadingBox" :show="showOverlay" :z-index="3001">
      <van-loading size="24px">加载中...</van-loading>
    </van-overlay>
    <div>
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        style="min-height: calc(100vh - 46px)"
      >
        <div class="box" style="min-height: calc(100vh - 46px)">
          <van-swipe-cell v-for="(item, index) in historyArr" :key="index">
            <van-card
              :desc="'来源：' + (item.source || '未知来源')"
              :title="item.title.replace(/[\n\r\t]/g, '')"
              class="record-card"
            >
              <template #thumb>
                <div
                  class="cover"
                  :style="'background-image: url(' + item.img + ');'"
                />
              </template>
              <template #price>
                {{ "点击恢复到播放\t" + item.text.replace(/[\n\r\t]/g, "") }}
              </template>
              <template #tag v-if="item.isTop">
                <van-tag color="rgba(32, 18, 217, 255)" style="font-weight: 700"
                  >置顶</van-tag
                >
              </template>
            </van-card>
            <template #left>
              <van-button
                square
                type="default"
                class="top-button"
                :text="item.isTop ? '取消' : '置顶'"
                @click="topRecord(item, item.isTop)"
                :style="{
                  border: 'none',
                  color: item.isTop ? '#3b45ef' : '#fff'
                }"
                :color="
                  item.isTop ? 'rgba(59,69,239,.1)' : 'rgba(32, 18, 217, 255)'
                "
              />
            </template>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="deleteRecord(item)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import { Toast } from "vant";
import ScrollBar from "@better-scroll/scroll-bar";
import store from "@/store";
import { validatenull } from "@/utils/validate";

BScroll.use(ScrollBar);

export default {
  name: "history",
  data() {
    return {
      showOverlay: true,
      historyArr: [],
      isLoading: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.setTimeout(async () => {
        await this.getData();
      }, 1500);
    });
  },
  methods: {
    fetchSringToObject(url, headers) {
      if (window.fy_bridge_app) {
        let file = window.request(url, headers || {});
        if (validatenull(file)) file = [];
        else file = JSON.parse(file);
        return file;
      }
    },
    async getData() {
      this.showOverlay = true;
      store.dispatch("bar/setTitle", "历史记录管理");
      if (window.fy_bridge_app) {
        let xx_history = this.fetchSringToObject(
          "hiker://files/nirvana/nirvana_xx_history"
        );
        let xj_history = this.fetchSringToObject(
          "hiker://files/nirvana/nirvana_xj_history"
        );
        let historyArr = [...xx_history, ...xj_history];
        historyArr = historyArr.sort((a, b) => b.time - a.time);
        this.historyArr = historyArr;
        this.showOverlay = false;
      } else {
        this.showOverlay = false;
      }
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
    topRecord(item, isCancel) {
      this.showOverlay = true;
      if (item.source == "涅槃.小虾") {
        let xx_history = this.fetchSringToObject(
          "hiker://files/nirvana/nirvana_xx_history"
        );
        xx_history.forEach((h) => {
          if (h.id == item.id && !isCancel) {
            h.originalTime = h.time;
            h.time = 100000000000000;
            h.isTop = true;
          }
          if (h.id == item.id && isCancel) {
            h.time = h.originalTime;
            h.isTop = false;
          }
        });
        xx_history = JSON.stringify(xx_history);
        window.fy_bridge_app.writeFile(
          "hiker://files/nirvana/nirvana_xx_history",
          xx_history
        );
        this.getData();
        if (isCancel) Toast("取消成功");
        else Toast("置顶成功");
      } else if (item.source == "涅槃.小橘") {
        let xj_history = this.fetchSringToObject(
          "hiker://files/nirvana/nirvana_xj_history"
        );
        xj_history.forEach((h) => {
          if (h.id == item.id && !isCancel) {
            h.originalTime = h.time;
            h.time = 100000000000000;
            h.isTop = true;
          }
          if (h.id == item.id && isCancel) {
            h.time = h.originalTime;
            h.isTop = false;
          }
        });
        xj_history = JSON.stringify(xj_history);
        window.fy_bridge_app.writeFile(
          "hiker://files/nirvana/nirvana_xj_history",
          xj_history
        );
        this.getData();
        if (isCancel) Toast("取消成功");
        else Toast("置顶成功");
      } else {
        if (isCancel) Toast("取消失败，未知来源");
        else Toast("置顶失败，未知来源");
      }
      this.$nextTick(() => {
        this.showOverlay = false;
      });
    },
    deleteRecord(item) {
      this.showOverlay = true;
      if (item.source == "涅槃.小虾") {
        let xx_history = this.fetchSringToObject(
          "hiker://files/nirvana/nirvana_xx_history"
        );
        xx_history.forEach((h, i) => {
          if (h.id == item.id) xx_history.splice(i, 1);
        });
        xx_history = JSON.stringify(xx_history);
        window.fy_bridge_app.writeFile(
          "hiker://files/nirvana/nirvana_xx_history",
          xx_history
        );
        this.getData();
        Toast("删除成功");
      } else if (item.source == "涅槃.小橘") {
        let xj_history = this.fetchSringToObject(
          "hiker://files/nirvana/nirvana_xj_history"
        );
        xj_history.forEach((h, i) => {
          if (h.id == item.id) xj_history.splice(i, 1);
        });
        xj_history = JSON.stringify(xj_history);
        window.fy_bridge_app.writeFile(
          "hiker://files/nirvana/nirvana_xj_history",
          xj_history
        );
        this.getData();
        Toast("删除成功");
      } else {
        Toast("删除失败，未知来源");
      }
      this.$nextTick(() => {
        this.showOverlay = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../common/style/var";

.loadingBox {
  display: flex;
  align-items: center;
  justify-content: center;
}
.record-card {
  margin: 0;
  background-color: #fff;
}
.delete-button,
.top-button {
  height: 100%;
}

#history {
  .van-card {
    position: relative;
    box-sizing: border-box;
    padding: 8px 16px;
    color: #323233;
    font-size: 12px;
    background-color: #ffffff;
    margin-top: 10px;
  }
  .van-card__thumb {
    position: relative;
    -webkit-box-flex: 0;
    -webkit-flex: none;
    flex: none;
    width: 0.7125rem;
    height: 0.95rem;
    margin-left: 14px;
    display: block;
    width: 0.7125rem;
    height: 0.95rem;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 8px;
  }

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
</style>