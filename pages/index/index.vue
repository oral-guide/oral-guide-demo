<template>
  <div>
    <!-- 在这里引入组件 -->
    {{ ws }}
    <div class="game" v-for="game in games" :key="game.name" @click="navigate">
      {{ game.name }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const recorderManager = uni.getRecorderManager();
const audio = uni.createInnerAudioContext();
export default {
  data() {
    return {
      games: [
        { name: "谁是卧底" },
        { name: "XXX" },
        { name: "好玩的游戏" },
        { name: "PK学习" },
      ],
    };
  },
  computed: {
    ...mapState(["ws"])
  },
  methods: {
    navigate() {
      uni.navigateTo({
        url: "../hall/index",
        success: (res) => console.log(res),
        fail: (res) => console.log(res),
      });
    }
  },
  onLoad() {
    recorderManager.onStop((res) => {
      console.log("recorder stop" + JSON.stringify(res));
      this.uploadAudio(res.tempFilePath)
    });
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
