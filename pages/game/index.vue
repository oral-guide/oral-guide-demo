<template>
<div>
<userCard>
</useRCard>
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