<template>
  <div class="room">
    <div class="players">
      <div class="info">
          <div class="seats">{{ curRoom.users.length }} / {{ curRoom.seats }}</div>
          <div class="msg">人满了自动开始</div>
      </div>
      <div class="player" v-for="i in curRoom.seats" :key="i">
        {{ curRoom.users[i].name || "+" }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["rooms", "user"]),
    curRoom() {
      return this.rooms.find((room) => room.roomId === this.user.roomId);
    },
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.curRoom.name,
    });
  },
};
</script>

<style scoped>
.room .players {
  width: 100%;
  height: 100%;
}

.info, .player {
  margin: 30px;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 13px;
  text-align: center;
}

.info .seats {
    font-size: 52px;
}
</style>