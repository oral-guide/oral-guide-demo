<template>
  <div>
    <van-popup
      class="popup"
      :show="show"
      :close="onClose"
      round
      position="bottom"
      custom-style="height: 60%"
    >
      <div class="chat-box">
        <header>讨论环节(第{{round+1}}轮) 倒计时 {{count}} s</header>
        <div class="msg-box">
          <scroll-view
            scroll-y="true"
            :scroll-into-view="'#msg'+msg.length-1"
            scroll-with-animation="true"
            class="msg"
            v-for="(item,index) in msgs"
            :key="index"
            :style="item.from==player.name?'flex-direction:row-reverse':''"
            :id="'msg'+index"
          >
            <div class="user-head">
              <div class="head">
                <van-image round width="2.5rem" height="2.5rem" src="/static/userimg.jpg" />
              </div>
            </div>
            <div class="user-msg">
              <div class="username" v-if="item.from!=player.name">{{item.from}}</div>
              <span :class="item.from==player.name?'right':'left'">{{item.content}}</span>
            </div>
          </scroll-view>
        </div>
        <div class="input-box">
          <input type="text" v-model="contentText" />
          <div class="btn" :class="{'btn-active':contentText}" @click="sendText()">发送</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: ["player", "round", "msgs"],
  data() {
    return {
      show: true,
      timer: null,
      contentText: null,
      count: 30
      // msgs:store.getters.msgs
      // msgs: [
      // { from: "小红", content: "我认为...." },
      // { from: "小明", content: "AAAA" },
      // { from: "跟着党走", content: "你才是" }
      // ]
    };
  },

  mounted() {
    console.log(this.msgs);
  },
  methods: {
    ...mapMutations(["setRoomState"]),
    showPopup() {
      console.log("pop up");
      this.show = true;
      this.countdown();
      // this.round++
    },
    onClose() {
      this.show = false;
      console.log("close");
      this.setRoomState("voting");
    },
    sendText() {
      let msg = {
        from: this.player.name,
        content: this.contentText
      };
      this.$util.sendDiscussionMsg(msg);
      this.contentText = "";
    },
    countdown() {
      this.timer = setInterval(() => {
        this.count--;
        if (this.count == 0) {
          clearInterval(this.timer);
          this.count = 60;
          this.onClose();
        }
      }, 1000);
    }
  }
};
</script>

<style  lang="scss" scoped>
.chat-box {
  margin: 0 auto;
  background: #fafafa;
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  header {
    position: fixed;
    width: 100%;
    height: 3rem;
    background: #ff6600;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
    font-size: 1rem;
    // border-radius: 15% 15% 0 0;
    // padding-top:-10rpx;
  }
  .msg-box {
    position: absolute;
    height: calc(100% - 6.5rem);
    width: 100%;
    margin-top: 3rem;
    overflow-y: scroll;
    .msg {
      width: 95%;
      min-height: 2.5rem;
      margin: 1rem 0.5rem;
      position: relative;
      display: flex;
      justify-content: flex-start !important;
      .user-head {
        min-width: 2.5rem;
        width: 20%;
        width: 2.5rem;
        height: 2.5rem;
        // border-radius: 50%;
        // background: #f1f1f1;
        display: flex;

        // justify-content: center;
        // align-items: center;
        .head {
          width: 1.2rem;
          height: 1.2rem;
        }

        // position: absolute;
      }
      .user-msg {
        width: 80%;
        // position: absolute;
        word-break: break-all;
        position: relative;
        z-index: 5;
        span {
          display: inline-block;
          padding: 0.5rem 0.7rem;
          border-radius: 0.5rem;
          margin-top: 0.2rem;
          font-size: 0.88rem;
        }
        .username {
          font-size: 0.2rem;
        }
        .left {
          background: rgb(145, 143, 143);
          color: white;
          animation: toLeft 0.5s ease both 1;
        }
        .right {
          float: right;
          background: #f0b943;
          color: white;
          animation: toright 0.5s ease both 1;
        }
        @keyframes toLeft {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
        @keyframes toright {
          0% {
            opacity: 0;
            transform: translateX(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
      }
    }
  }
  .input-box {
    padding: 0 0.5rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 3rem;
    background: #fafafa;
    box-shadow: 0 0 5px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      height: 2rem;
      display: inline-block;
      width: 100%;
      padding: 0.4rem;
      border: none;
      border-radius: 0.2rem;
      font-size: 0.88rem;
    }
    .btn {
      display: flex;
      height: 2rem;
      min-width: 4rem;
      background: #e0e0e0;
      padding: 0.4rem;
      font-size: 0.88rem;
      color: white;
      border-radius: 0.2rem;
      margin-left: 0.5rem;
      transition: 0.5s;
      justify-content: center;
      align-items: center;
    }
    .btn-active {
      background: #f78a42;
    }
  }
}
</style>