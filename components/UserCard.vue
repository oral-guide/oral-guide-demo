<template>
    <div class="usercard">
        <van-row type="flex" justify="space-around">
            <van-image round width="4rem" height="4rem" src="/static/userimg.jpg"/>
        </van-row>

    </div>
</template>

<script>
    export default {
        data(){
            return{
                users:[
                    {id:01,
                    name:"A",
                    isSpy:false,
                    isAlive:true,
                    isSpeaking:false,
                    isOwner:true,
                    
                    },
                    {id:02,
                    name:"B",
                    isSpy:true,
                    isAlive:true,
                    isSpeaking:false,
                    isOwner:false
                    },
                    {id:03,
                    name:"C",
                    isSpy:false,
                    isAlive:true,
                    isSpeaking:false,
                    isOwner:false
                    },
                    {id:04,
                    name:"D",
                    isSpy:false,
                    isAlive:true,
                    isSpeaking:false,
                    isOwner:false
                    }
                ]
                   
                
            };
        }
    }
</script>

<style scoped>

</style>