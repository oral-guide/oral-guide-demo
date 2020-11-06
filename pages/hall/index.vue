<template>
  <div class="hall">
    <!-- 房间区域 -->
    <div class="rooms">
      <div class="room" v-for="room in rooms" :key="room.roomId">
        <div class="title">{{ room.name }}</div>
        <div class="players">{{ room.users.length }} / {{ room.seats }}</div>
        <van-button>加入</van-button>
      </div>
    </div>
    <!-- 按键区域 -->
    <van-button
      class="btn"
      type="primary"
      block
      color="#ff6600"
      @tap="addRoom"
    >
      创建房间
    </van-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["rooms"]),
  },
  methods: {
    addRoom() {
      uni.navigateTo({
        url: "../addRoom/index",
      });
    },
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
.rooms {
  width: 100%;
  height: calc(100% - 60px);
}
.btn {
  position: absolute;
  width: calc(100% - 40px);
  left: 20px;
  bottom: 20px;
}
</style>