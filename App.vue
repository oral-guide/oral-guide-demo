<script>
	import { mapMutations } from "vuex";
	export default {
		methods: {
			...mapMutations(["setWs", "setUsername"]),
		},
		onLaunch: async function() {
			console.log('App Launch');
			this.$util.openWebsocket();
			let name = await this.$util.getRandomNickname();
			this.setUsername(name);
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		height: 100%;
	}
</style>
