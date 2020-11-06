<template>
  <div class="add">
    <van-field
      v-model="form.name"
      name="房间名字"
      label="房间名字"
      placeholder="请输入房间名字"
    />
    <van-field
      v-model="form.pswd"
      type="password"
      name="密码"
      label="密码(选填)"
      placeholder="请输入密码"
    />
    <div class="field">
      <span>人数限制</span>
      <van-stepper class="right" v-model="form.seats" min="4" max="8" />
    </div>
    <div style="margin: 16px">
      <van-button round block type="info" color="#ff6600" @tap="createRoom">
        创建
      </van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      form: {
        roomId: new Date().getTime(),
        name: "快来一起愉快练习口语吧~",
        pswd: "",
        seats: 8,
      },
    };
  },
  computed: {
      ...mapState(["user"])
  },
  methods: {
    async createRoom() {
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
          }
      });
      this.form = {
        name: "快来一起愉快练习口语吧~",
        pswd: "",
        seats: 8,
      };
      uni.navigateBack();
    },
  },
};
</script>

<style scoped>
.add {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.field {
  padding: 16px;
  box-sizing: border-box;
  color: #646566;
  font-size: 14px;
}
.right {
  margin-top: -6px;
  float: right;
}
</style>