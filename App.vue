<script>
	import { mapMutations } from "vuex";
	export default {
		methods: {
			...mapMutations(["setWs", "setUsername"]),
		},
		onLaunch: async function() {
			console.log('App Launch');
			let name = await this.$util.getRandomNickname();
			this.setUsername(name);
			this.$util.openWebsocket();
			
			// 获取录音权限
			uni.authorize({
			    scope: 'scope.record',
			    success() {
			        console.log('已获取录音权限！');
			    }
			})
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
