<template>
  <!-- <div class="usercard">
    <van-row class="container" gutter="2" type="flex">
      <van-col v-for="(item,index) in users" :key="index">
        <div class="user" :class="{isdead:!item.isAlive,isSpeaking:item.isSpeaking}" >
          <van-image round width="3rem" height="3rem" src="/static/userimg.jpg" />
          <div class="number">{{index+1}}</div>
          <div class="username">{{item.name}}</div>
        </div>
      </van-col>
    </van-row>
  </div>-->
    <div class="usercard">
    <div class="container">
      <div class="user"  v-for="(item,index) in users" :key="index" :class="{isdead:!item.isAlive,isSpeaking:item.isSpeaking}" >
        <van-image v-if="item.isSpeaking" round width="3.5rem" height="3.5rem" src="/static/userimg.jpg" />
        <van-image v-else round width="3rem" height="3rem" src="/static/userimg.jpg" />
        <div class="number">{{index+1}}</div>
        <div class="username">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:["users"],
  data() {
    return {
      
     };
  }
};
</script>

<style  scoped>
.usercard {
  position: absolute;
  margin: 3%;
  bottom: 0;
}
.container{
  display: flex;
  overflow-x: auto;
  /* justify-content: space-between; */
}
.user {
  position: relative;
  font-size: 0.5rem;
  margin-left: .2rem;
}

.username {
  text-align: center;
}

.number {
  background-color: #ff6600;
  text-align: center;
  height: 0.8rem;
  width: 0.8rem;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  color: azure;
  overflow: hidden;
  border-color: #ff6600;
}
.isdead {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
}
</style>