<template>
  <div class="usercard">
    <van-row class="container" gutter="3" type="flex" justify="space-around">
      <van-col v-for="(item,index) in users" :key="index">
        <div class="user" :class="{isdead:!item.isAlive,isSpeaking:item.isSpeaking}" >
          <van-image round width="2rem" height="2rem" src="/static/userimg.jpg" />
          <div class="number">{{item.id}}</div>
          <div class="username">{{item.name}}</div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        {
          id: 1,
          name: "A",
          isSpy: false,
          isAlive: true,
          isSpeaking: false,
          isOwner: true
        },
        {
          id: 2,
          name: "B",
          isSpy: true,
          isAlive: true,
          isSpeaking: false,
          isOwner: false
        },
        {
          id: 3,
          name: "C",
          isSpy: false,
          isAlive: true,
          isSpeaking: true,
          isOwner: false
        },
        {
          id: 4,
          name: "D",
          isSpy: false,
          isAlive: false,
          isSpeaking: false,
          isOwner: false
        },
        {
          id: 5,
          name: "SSS",
          isSpy: false,
          isAlive: false,
          isSpeaking: false,
          isOwner: false
        },
        {
          id: 6,
          name: "AAADDD",
          isSpy: false,
          isAlive: false,
          isSpeaking: false,
          isOwner: false
        },
        {
          id: 7,
          name: "SLGGG",
          isSpy:  true,
          isAlive: false,
          isSpeaking: false,
          isOwner: false
        },
        {
          id: 8,
          name: "KCC",
          isSpy: false,
          isAlive: true,
          isSpeaking: false,
          isOwner: false
        }
      ]
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

.user {
  position: relative;
  font-size: .5rem;
}

.username {
  text-align: center;
}

.number {
  background-color: #ff6600;
  text-align: center;
  height: .8rem;
  width: .8rem;
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
.isSpeaking::after{
    content: "speaking";
    color: #ff6600;
    position: absolute;
    top: 1.5rem;
    text-align: center;
    font-size: 0.6rem;
    
}
</style>