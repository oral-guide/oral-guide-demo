<template>
  <div class="hall">
    这里是大厅，应该有很多房间
    <van-button class="btn" type="primary" block color="#ff6600">创建房间</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
};
</script>

<style scoped>
.hall {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
}
.btn {
    position: absolute;
    width: calc(100% - 40px);
    left: 20px;
    bottom: 20px;
}
</style>