<template>
  <div class="hall">
    <!-- 房间区域 -->
    <div class="rooms">
      <div class="room" v-for="room in rooms" :key="room.roomId">
        <div class="title">{{ room.name }}</div>
        <div class="players">{{ room.users.length }} / {{ room.seats }}</div>
        <van-button color="#ff6600" class="join" @click="enterRoom(room.roomId)" :disabled="allowClick(room)">加入</van-button>
      </div>
    </div>
    <!-- 按键区域 -->
    <van-button class="btn" type="primary" block color="#ff6600" @tap="addRoom">
      创建房间
    </van-button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["rooms", "user"]),
    allowClick() {
      return (room) => {
        return room.seats <= room.users.length
      }
    }
  },
  methods: {
    ...mapMutations(["setUserRoom"]),
    addRoom() {
      uni.navigateTo({
        url: "../addRoom/index",
      });
    },
    async enterRoom(roomId) {
      this.setUserRoom(roomId);
      await this.$util.sendSocketMsg({
        type: "enterRoom",
        data: {
          roomId,
          user: this.user,
        },        
      })
      uni.navigateTo({
        url: "../room/index"
      })
    }
  },
  async onShow() {
    if (this.user.roomId && this.user.canLeave) {
      await this.$util.sendSocketMsg({
        type: "leaveRoom",
        data: {
          roomId: this.user.roomId,
          user: this.user
        }
      })
      this.setUserRoom(0)
    }
    // 防止创建房间后navigateBack时触发离开房间，加一层canLeave保护
    this.user.canLeave = true;
  }
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
.rooms {
  width: 100%;
  height: calc(100% - 60px);
}
.room {
  padding: 13px;
  border: 1px solid #000;
  border-radius: 3px;
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
  width: calc(100% - 40px);
  left: 20px;
  bottom: 20px;
}
</style>