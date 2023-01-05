<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "TheHome",
  methods: {
    // 点击退出按钮，退出登录--1.删除token；2.重定向到登录页面
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>