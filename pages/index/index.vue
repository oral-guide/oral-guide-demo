<template>
  <div>
    <!-- 在这里引入组件 -->
    <div class="game" v-for="game in games" :key="game.name" @click="navigate">
      {{ game.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      games: [
        { name: "谁是卧底" },
        { name: "XXX" },
        { name: "好玩的游戏" },
        { name: "PK学习" }
      ]
    };
  },
  onLoad() {},
  methods: {
    navigate() {
      console.log(111);
      uni.navigateTo({ url: "../hall/index",
        success: (res) => console.log(res),
        fail: (res) => console.log(res),
      });
    }
  },
};
</script>

<style>
.game {
  position: relative;
  width: 80%;
  left: 10%;
  height: 100px;
  margin: 20px 0;
  border: 1px solid #333;
  border-radius: 3px;
  text-align: center;
}
</style>
