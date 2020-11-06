<template>
    <div>
        <!-- 这里是游戏界面，在这里放组件 -->
    </div>
</template>

<script>
import { mapState, mapGetter } from "vuex";
    export default {
        computed: {
            ...mapState(["players"]),
            ...mapGetter(["player"])
        },
    }
</script>

<style scoped>

</style>