<template>
  <div>
    <div>
      <van-notice-bar left-icon="volume-o" :text="noticeText" />
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
      <userCard :users="players"> </userCard>
      <!-- 30s 倒计时 -->
      <van-toast id="timer" />
      <!-- 录音倒计时 -->
      <van-popup :show="showRecordingDialog" :round="true" :close-on-click-overlay="false">
        <div class="recordMsg">录音中。。。还剩{{ timerCount }}s</div>
        <van-button color="#ff6600" block>提前结束</van-button>
      </van-popup>
    </div>
  </div>
</template>
   

<script>
import { mapGetters, mapMutations } from "vuex";
import Toast from "../../wxcomponents/vant/toast/toast";
const recorderManager = uni.getRecorderManager();
const audio = uni.createInnerAudioContext();

export default {
  data() {
    return {
      timer: null, // 倒计时
      timerCount: 3, // 倒计时时间
      audioSrcList: [], // 录音播放列表
      curIndex: 0, // 录音播放位置，对应玩家位置
      round: 0, // 游戏轮数：大于等于1时就每次调换头尾顺序
      dir: 0, // 方向：0为从头到尾，1为从尾到头
      showRecordingDialog: false, // 录音弹框
      noticeText: "", // 通知栏消息
    };
  },
  computed: {
    ...mapGetters(["players", "player", "word", "game", "gameState"]),
  },
  methods: {
    ...mapMutations(["setRoomState"]),
    // 准备状态调用的方法，展示倒计时等
    onPreparing(time) {
      const toast = Toast({
        duration: 0,
        message: `离录音开始还有${time}s`,
        selector: "#timer",
      });
      this.timerCount = time;
      this.timer = setInterval(() => {
        this.timerCount--;
        toast.setData({
          message: `离录音开始还有${this.timerCount}s`,
        });
        if (this.timerCount === 0) {
          // 到达30s的时候，开始录音
          clearInterval(this.timer);
          Toast.clear();
          // 全体开始录音
          this.setRoomState("recording");
        }
      }, 1000);
    },
    // 录音状态调用的方法，包括开始录音，展示倒计时，结束自动上传等
    onRecording(time) {
      this.startRecord();
      this.startRecordTimer(time);
    },
    startRecord() {
      recorderManager.start({
        format: "mp3",
        sampleRate: 44100,
        encodeBitRate: 128000,
      });
    },
    startRecordTimer(time) {
      this.showRecordingDialog = true;
      this.timerCount = time;
      this.timer = setInterval(() => {
        this.timerCount--;
        if (this.timerCount === 0) {
          // 时间到，强制结束录音并上传
          clearInterval(this.timer);
          this.showRecordingDialog = false;
          this.endRecord();
        }
      }, 1000);
    },
    // 结束录音的method：提前结束的按钮调用；或满30s系统自动调用（在onLoad中监听结束上传
    endRecord() {
      recorderManager.stop();
    },
    // 上传录音的method，可获取到后端传回的url
    async uploadAudio(filePath) {
      // 等待其他玩家
      Toast({
        duration: 0,
        message: "等待其他玩家录音中...",
        selector: "#timer",
      });
      // 上传录音
      let res = await this.$util.uploadAudio(filePath);
      let url = JSON.parse(res[1].data).data.url;
      // 将玩家录音的url推进records数组
      this.player.records.push(url);
      // 通过websocket同步自己的录音
      this.$util.updatePlayerInfo({
        subKey: "records",
        playerName: this.player.name,
        data: { records: this.player.records },
      });
    },

    // 播放录音状态调用的方法，包括初始化播放以及依据顺序自动播放下一个
    onPlaying() {
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
      audio.src = this.audioSrcList[this.curIndex];
      audio.play();
    },
    // 根据方向，顺或反播放下一个玩家的录音
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
        Toast.loading({
          duration: 0,
          forbidClick: true,
          message: "加载中...",
          selector: "#timer"
        })
        this.$util.emitRoomState("discussing");
        return;
      }
      audio.src = this.audioSrcList[this.curIndex];
      audio.play();
    },
    // 讨论状态调用的方法
    onDiscussing() {},
    // 投票状态调用的方法
    onVoting() {},
    // 游戏结束调用的方法
    onEnding() {},
  },
  watch: {
    gameState(n) {
      // 分为三种情况
      // server通知改变，如改变为preparing（下一轮开始），playing（录音结束，开始播放），discussing，revoting（重新投票）
      // client直接改变，无需在server进行更新，如preparing倒计时结束直接录音
      // client发起emitRoomState，通知server我这头搞定了，等server确认所有玩家都搞定，再回到第一种情况
      switch (n) {
        case "preparing":
          // 新一轮开始
          this.onPreparing(3);
          this.noticeText = this.round ? this.game.voteMsg : "准备环节";
          break;
        case "recording":
          this.onRecording(3);
          this.noticeText = "全体录音中。。。";
          break;
        case "playing":
          // TODO 全体录音结束
          Toast.clear();
          this.onPlaying();
          this.noticeText = `当前发言玩家：【${this.players[this.curIndex].name}】`;
          break;
        case "discussing":
          Toast.clear();
          this.onDiscussing();
          this.noticeText = "讨论环节";
          break;
        case "voting":
          this.onVoting();
          this.noticeText = "投票环节";
          break;
        case "revoting":
          this.onVoting();
          break;
        case "ending":
          this.onEnding();
          this.noticeText = this.game.voteMsg;
          break;
      }
    },
  },
  onLoad() {
    // 录音结束后自动进行上传
    recorderManager.onStop((res) => {
      this.uploadAudio(res.tempFilePath);
    });
    // 自动播放列表下一名玩家录音
    audio.onEnded((res) => {
      this.playNext();
    });
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
.recordMsg {
  box-sizing: border-box;
  padding: 20px;
}
</style>