<template>
<div>
<userCard>
</useRCard>
</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
    export default {
        computed: {
            ...mapState(["players"]),
            ...mapGetters(["player"])
        },
    }
</script>

<style scoped>

</style>