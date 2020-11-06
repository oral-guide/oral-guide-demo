<template>
  <div class="hall">
    <!-- 房间区域 -->
    <div class="rooms">
      <template v-if="rooms.length">
        <div class="room" v-for="room in rooms" :key="room.roomId">
          <div class="title">
            {{ room.name }}
            <van-icon name="lock" size="40rpx" class="right" v-if="room.pswd" />
          </div>
          <div class="players">{{ room.users.length }} / {{ room.seats }}</div>
          <van-button
            color="#ff6600"
            class="join"
            @click="joinRoom(room)"
            :disabled="allowClick(room)"
          >
            加入
          </van-button>
        </div>
      </template>
      <template v-else>
        还没有房间哦，快去创建一个吧~
      </template>
    </div>
    <!-- 按键区域 -->
    <van-button class="btn" type="primary" block color="#ff6600" @tap="addRoom">
      创建房间
    </van-button>
    <!-- 创建房间弹框 -->
    <van-dialog
      :show="show"
      use-title-slot
      use-slot
      confirm-button-text="创建"
      confirm-button-color="#ff6600"
      @confirm="createRoom"
    >
      <view slot="title">
        <view style="display: inline-block">新建房间</view>
        <van-icon name="cross" size="40rpx" class="close" @tap="closeDialog" />
      </view>
      <view class="form">
        <van-field
          :value="form.name"
          @input="handleInput($event, 'name')"
          name="房间名字"
          label="房间名字"
          placeholder="请输入房间名字"
        />
        <van-field
          :value="form.pswd"
          @input="handleInput($event, 'pswd')"
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入密码"
        />
        <div class="field">
          <span>人数限制</span>
          <van-stepper
            class="right move-up"
            :value="form.seats"
            @change="handleInput($event, 'seats')"
            min="4"
            max="8"
          />
        </div>
      </view>
    </van-dialog>
    <!-- 输入房间密码 -->
    <van-dialog
      :show="showPswd"
      title="请输入房间密码"
      use-slot
      show-cancel-button
      confirm-button-text="确认"
      confirm-button-color="#ff6600"
      @confirm="submitPswd"
    >
      <view class="form">
        <van-field
          :value="pswd"
          @input="inputPswd($event)"
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入密码"
        />
      </view>
    </van-dialog>
    <!-- toast提示 -->
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Toast from '../../wxcomponents/vant/toast/toast';
export default {
  data() {
    return {
      show: false,
      form: {
        roomId: new Date().getTime(),
        name: "一起愉快练习口语吧~",
        pswd: "",
        seats: 8,
      },
      // 输入房间密码相关
      targetRoom: null,
      showPswd: false,
      pswd: "",
    };
  },
  computed: {
    ...mapState(["rooms", "user"]),
    allowClick() {
      return (room) => {
        return room.seats <= room.users.length;
      };
    },
  },
  methods: {
    ...mapMutations(["setUserRole", "setUserRoom"]),
    handleInput(e, key) {
      this.form[key] = e.detail;
    },
    inputPswd(e) {
      this.pswd = e.detail;
    },
    validator(val) {
      return val === this.targetRoom.pswd;
    },
    addRoom() {
      this.show = true;
    },
    async createRoom() {
      this.setUserRole(true);
      this.setUserRoom(this.form.roomId);
      await this.$util.sendSocketMsg({
        type: "createRoom",
        data: {
          type: "spy",
          ...this.form,
        },
      });
      await this.$util.sendSocketMsg({
        type: "enterRoom",
        data: {
          roomId: this.form.roomId,
          user: this.user,
        },
      });
      this.form = {
        name: "快来一起愉快练习口语吧~",
        pswd: "",
        seats: 8,
      };
      this.show = false;
      uni.navigateTo({
        url: "../room/index",
      });
    },
    joinRoom(room) {
      if (room.pswd) {
        // 有密码的情况
        this.targetRoom = room;
        this.showPswd = true;
      } else {
        this.enterRoom(room.roomId);
      }
    },
    submitPswd() {
      if (this.pswd !== this.targetRoom.pswd) {
        Toast.fail('密码错误！');
      } else {
        this.enterRoom();
      }
      this.pswd = "";
      this.showPswd = false;
    },
    async enterRoom(roomId) {
      if (!roomId) roomId = this.targetRoom.roomId;
      this.setUserRoom(roomId);
      await this.$util.sendSocketMsg({
        type: "enterRoom",
        data: {
          roomId,
          user: this.user,
        },
      });
      uni.navigateTo({
        url: "../room/index",
      });
    },
    closeDialog() {
      this.show = false;
    },
  },
  async onShow() {
    if (this.user.roomId) {
      await this.$util.sendSocketMsg({
        type: "leaveRoom",
        data: {
          roomId: this.user.roomId,
          user: this.user,
        },
      });
      this.setUserRoom(0);
    }
  },
};
</script>

<style scoped>
.hall {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.rooms {
  position: relative;
  top: 60px;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
  padding-top: 20px;
  box-sizing: border-box;
}
.room {
  padding: 13px;
  border: 1px solid #000;
  border-radius: 3px;
  margin: 20px 15px;
  margin-top: 0;
}
.room .title {
  font-size: 18px;
  margin-bottom: 13px;
}
.room .players {
  display: inline-block;
  margin-top: 10px;
  font-size: 20px;
}
.room .join {
  float: right;
}
.btn {
  position: absolute;
  width: calc(100% - 30px);
  left: 15px;
  top: 10px;
}

/* 弹框 */
.close {
  float: right;
  margin-right: 20px;
}
.form {
  padding: 20px;
}
.field {
  padding: 16px;
  box-sizing: border-box;
  color: #646566;
  font-size: 14px;
}
.right {
  float: right;
}
.move-up {
  margin-top: -6px;
}
</style>