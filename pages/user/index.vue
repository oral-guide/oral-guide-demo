<template>
	<view>
		{{ user.name }}
	</view>
</template>

<script>
	import { mapState } from "vuex";
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapState(["user"])
		},
		methods: {
			
		},
		onShow() {
			console.log("test");
			this.$util.sendSocketMsg({name: this.user.name, msg: "hello"});
		}
	}
</script>

<style>

</style>
