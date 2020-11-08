<template>
  <div class="container">
    <van-popup
      show="{{ show }}"
      round
      position="bottom"
      custom-style="height: 20%"
      bind:close="onClose"
    />
  </div>
</template>

<script>
export default {};
</script>

<style  lang="scss" scoped>
</style>