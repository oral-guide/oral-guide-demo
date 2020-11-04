<template>
  <!-- <view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view> -->
  <div>
    <van-picker v-if="flag" :columns="columns" @change="changePicker" />
    <van-button @click="show">显示</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello UniApp",
      columns: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
      flag: false,
    };
  },
  onLoad() {},
  methods: {
    show() {
      console.log("1 =", "show");
      this.flag = !this.flag;
    },
    changePicker(event) {
      console.log("1 =", event);
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
