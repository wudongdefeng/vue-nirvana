<template>
  <div class="main">
    <van-sticky>
      <van-nav-bar :title="title" left-text="返回" left-arrow>
        <template #right>
          <a href="hiker://search?s=**">
            <van-icon
              name="search"
              size="18"
              color="rgba(34, 34, 34, 255)"
              @click="hikerSearch"
          /></a>
        </template>
        <template #left>
          <van-icon
            name="arrow-left"
            size="18"
            color="rgba(34, 34, 34, 255)"
            @click="hikerHome"
          />
          <span
            class="van-nav-bar__text"
            style="color: rgba(34, 34, 34, 255)"
            @click="hikerHome"
            >返回</span
          >
        </template>
      </van-nav-bar>
    </van-sticky>
    <app-main />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AppMain from "./components/AppMain.vue";
export default {
  computed: {
    ...mapGetters(["title"]),
  },
  components: { AppMain },
  methods: {
    hikerSearch() {
      window.location.href = "hiker://search?s=**";
    },
    hikerHome() {
      window.location.href = "hiker://home";
    },
  },
};
</script>

<style lang="less">
@import "../common/style/var";
@import "../common/style/base";

html,
body,
.main {
  min-width: 100vw;
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
</style>
<style>
.van-nav-bar .van-icon {
  color: rgba(34, 34, 34, 255);
}
.van-nav-bar__text {
  color: rgba(34, 34, 34, 255);
}
</style>