<template>
  <div>
    <div>
      <van-notice-bar left-icon="volume-o" text="当前发言的是：玩家1" />
      <div class="desc">
        <div class="img">
          <img src="../../static/library.png" alt="" />
        </div>
        <div class="word">library</div>
        <div class="def">
          A room or set of rooms where books and other literary materials are
          kept
        </div>
      </div>
      <div class="vote" v-show="isVote">123546</div>
      <GameConsole />
      <userCard :users="players"> </userCard>
      <!-- 30s 倒计时 -->
      <van-toast id="timer" />
    </div>
  </div>
</template>
   

<script>
import { mapState, mapGetters } from "vuex";
import Toast from "../../wxcomponents/vant/toast/toast";
const recorderManager = uni.getRecorderManager();
const audio = uni.createInnerAudioContext();

export default {
  data() {
    return {
      timer: null,
      timerCount: 3,
      audioSrcList: [],
      curIndex: 0,
      round: 0, // 游戏轮数：大于等于1时就每次调换头尾顺序
      dir: 0, // 方向：0为从头到尾，1为从尾到头
    };
  },
  computed: {
    // ...mapState([""]),
    ...mapGetters(["players", "player", "word", "game"]),
  },
  methods: {
    // 开始录音的method，由系统自行调用，并在此设置录音倒计时
    startRecord() {
      console.log("开始录音！");
      recorderManager.start({
        format: "mp3",
        sampleRate: 44100,
        encodeBitRate: 128000,
      });
      this.timer = setInterval(() => {
        console.log(`录音中···还剩${this.timerCount}s`);
        this.timerCount--;
        if (this.timerCount === 0) {
          // 时间到，强制结束录音并上传
          clearInterval(this.timer);
          this.endRecord();
        }
      }, 1000);
    },
    // 结束录音的method：提前结束的按钮调用；或满30s系统自动调用（在onLoad中监听结束上传
    endRecord() {
      console.log("录音结束！上传中···");
      recorderManager.stop();
    },
    // 上传录音的method，可获取到后端传回的url
    async uploadAudio(filePath) {
      let res = await this.$util.uploadAudio(filePath);
      let url = JSON.parse(res[1].data).data.url;
      // 将玩家录音的url推进records数组
      this.player.records.push(url);
      // 通过websocket同步自己的录音
      this.$util.updatePlayerInfo({
        subKey: "records",
        playerName: this.player.name,
        data: { records: this.player.records }
      });      
    },
    // 7 开始逐个播放
    // TODO 播放到哪个玩家，哪个玩家的头像就变大
    startPlaying() {
      console.log("录音全部上传完毕！");
      // 取出每名玩家records的最新一条，组成当前的播放列表
      this.audioSrcList = this.players.map(
        (player) => player.records[player.records.length - 1]
      );
      if (this.round) {
        // 第二轮及以后每轮都反转
        this.dir = Number(!this.dir);
      }
      if (this.dir === 0) {
        // 从头到尾
        this.curIndex = 0;
      } else {
        // 反过来
        this.curIndex = this.audioSrcList.length - 1;
      }
      console.log(this.audioSrcList);
      audio.src = this.audioSrcList[this.curIndex];
      audio.play();
      console.log("录音播放中···");
    },
    // 8 根据方向，顺或反播放下一个玩家的录音
    playNext() {
      if (this.dir === 0) {
        // 从头到尾
        this.curIndex++;
      } else {
        // 反过来
        this.curIndex--;
      }
      if (this.curIndex === -1 || this.curIndex === this.audioSrcList.length) {
        // 9 这一轮结束，讨论环节开始！
        this.round++;

        return;
      }
      audio.src = this.audioSrcList[this.curIndex];
      audio.play();
    },
  },
  watch: {
    game(n) {
      if (n.finishRecord) {
        // TODO 全体录音结束
        this.startPlaying();
        // finishRecord即收集到了足够录音才开启的闸门，通知全体录音结束，这里即重置闸门
        this.$util.updateGameInfo("finishRecord", false)
      }
    }
  },
  onLoad() {
    recorderManager.onStop((res) => {
      console.log("recorder stop" + JSON.stringify(res));
      this.uploadAudio(res.tempFilePath);
    });
    audio.onEnded((res) => {
      console.log(111);
      this.playNext();
    });
  },
  onShow() {
    // 1 页面加载完毕，游戏即刻开始

    // TODO 2 @心瑶 显示单词相关信息：此时卧底或平民对应的word已经从getters获取到
    // 3 全体30s倒计时
    // TODO @金萍 展示倒计时
    const toast = Toast.loading({
      duration: 0,
      forbidclick: true,
      message: "离游戏开始还有3s",
      selector: "#timer",
    });
    this.timer = setInterval(() => {
      console.log(`离游戏开始还有${this.timerCount}s`);
      this.timerCount--;
      toast.setData({
        message: `倒计时${this.timerCount}s`,
      });
      // 4 到达30s的时候，开始录音
      if (this.timerCount === 0) {
        console.log("游戏开始！");
        clearInterval(this.timer);
        Toast.clear();
        // 重置timerCount，为下一次倒计时做准备
        this.timerCount = 3;
        // 全体开始录音
        this.startRecord();

        // TODO 5 借助dialog或popup等组件，弹窗或其它方式提示用户正在录音中，显示倒计时及提前结束按钮（该按钮调用endRecord，并记得清除startRecord里的timer）
      }
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.desc {
  padding-top: 15px;
  height: 240px;
  text-align: center;

  .img {
    height: 150px;
    margin-bottom: 10px;

    img {
      display: block;
      margin: 0 auto;
      width: 150px;
      height: 150px;
    }
  }

  .word {
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: 700;
  }

  .def {
    padding: 0 20px;
    font-size: 12px;
  }
}
</style>