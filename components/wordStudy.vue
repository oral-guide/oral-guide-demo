<template>
  <scroll-view class="desc" scroll-y="true" v-if="word">
    <div class="img">
      <img :src="word.imgUrl" alt="" />
    </div>
    <div class="word">{{ word.name }}</div>
    <div class="def">
      <div class="def_hd">Definition(s):</div>
      <ul class="def_bd">
        <li v-for="(item, i) in word.definitions" :key="i">{{ item }}</li>
      </ul>
    </div>
    <div class="kw">
      <div class="kw_hd">Keywords:</div>
      <ul class="kw_bd">
        <li v-for="(item, i) in word.keywords" :key="i">{{ item }}</li>
      </ul>
    </div>
    <div class="sent">
      <div class="sent_hd">Example sentences:</div>
      <ul class="sent_bd">
        <li v-for="(item, i) in word.sentences" :key="i">
          <p>{{ item.english }}</p>
          <p>{{ item.chinese }}</p>
        </li>
      </ul>
    </div>
  </scroll-view>
</template>

<script>
export default {
    props: ['word']
}
</script>

<style lang="scss" scoped>
.desc {
  padding: 10px 0;
  height: 460px;

  .img {
    height: 150px;
    margin-bottom: 10px;

    img {
      display: block;
      margin: 0 auto;
      width: 150px;
      height: 150px;
    }
  }

  .word {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }

  .def,
  .kw,
  .sent {
    width: 85%;
    margin: 0 0 10px 30px;
    line-height: 28px;

    &_hd {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>