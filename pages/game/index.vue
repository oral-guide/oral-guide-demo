<template>
    <div>
        <van-notice-bar
            left-icon="volume-o"
            text="当前发言的是：玩家1"
        />
        <div class="desc">
            <div class="img">
                <img src="../../static/library.png" alt="">
            </div>
            <div class="word">library</div>
            <div class="def">A room or set of rooms where books and other literary materials are kept</div>
        </div>
        <div class="vote" v-show="isVote">123546</div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                isVote: true
            }
        }
    }
</script>

<style lang="scss" scoped>
.desc {
    padding-top: 15px;
    height: 240px;
    text-align: center;

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
        margin-bottom: 5px;
        font-size: 20px;
        font-weight: 700;
    }

    .def {
        padding: 0 20px;
        font-size: 12px;
    }
}
.vote {
    
}
</style>