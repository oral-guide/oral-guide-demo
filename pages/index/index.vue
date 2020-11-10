<template>
  <div>
    <!-- 在这里引入组件 -->
    <van-button @tap="startRecord">开始录音</van-button>
    <van-button @tap="endRecord">结束录音</van-button>
    <van-button @tap="playRecord">播放录音</van-button>
    <div class="game" v-for="game in games" :key="game.name" @click="navigate">
      {{ game.name }}
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
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
  onLoad() {
    recorderManager.onStop((res) => {
      console.log("recorder stop" + JSON.stringify(res));
      this.uploadAudio(res.tempFilePath)
    });
  },
  methods: {
    navigate() {
      uni.navigateTo({
        url: "../hall/index",
        success: (res) => console.log(res),
        fail: (res) => console.log(res),
      });
    },
    startRecord() {
      console.log("开始录音");
      recorderManager.start({
        format: "mp3",
        sampleRate: 44100,
        encodeBitRate: 128000,
      });
    },
    endRecord() {
      console.log("录音结束");
      recorderManager.stop();
    },
    async uploadAudio(filePath) {
      const option = {
        url: 'http://humansean.com:8000/upload/audio',
        filePath,
        // header,
        formData: {
          filePath
        },
        name: 'myFile',
      }
      uni.showLoading({
        title: '录音上传中...'
      })
      let res = await uni.uploadFile(option);
      console.log(JSON.parse(res[1].data).data.url);
      uni.hideLoading()
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
