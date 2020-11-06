<template>
  <div class="usercard">
    <van-row  class="container" gutter="4" type="flex" justify="space-around">
      <van-col v-for="(item,index) in users" :key="index">
        <div class="user" >
        <van-image round width="3rem" height="3rem" src="/static/userimg.jpg" />
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
        // {
        //   id: 4,
        //   name: "D",
        //   isSpy: false,
        //   isAlive: false,
        //   isSpeaking: false,
        //   isOwner: false
        // },
        // {
        //   id: 4,
        //   name: "D",
        //   isSpy: false,
        //   isAlive: false,
        //   isSpeaking: false,
        //   isOwner: false
        // },
        // {
        //   id: 4,
        //   name: "D",
        //   isSpy: false,
        //   isAlive: false,
        //   isSpeaking: false,
        //   isOwner: false
        // },
        // {
        //   id: 4,
        //   name: "D",
        //   isSpy: false,
        //   isAlive: false,
        //   isSpeaking: false,
        //   isOwner: false
        // }
        ]
    };
  }
};
</script>

<style  scoped>

.usercard{
    position:absolute;
    margin:3%;
    bottom: 0;}

.user{
    position: relative;
    }

.username{
    text-align: center;
}

.number{
    background-color: #ff6600;
    text-align: center;
    height: 1.1rem;
    width: 1rem;
    position: absolute;
    left:0;
    top: 0;
    border-radius: 50%;
    color: azure;
	overflow: hidden;
	border-color:#ff6600;   
}
</style>