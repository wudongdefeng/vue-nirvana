<template>
  <div class="main">
    <van-sticky>
      <van-nav-bar title="标题" left-text="返回" left-arrow>
        <template #right>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "./common/style/var";
@import "./common/style/base";

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