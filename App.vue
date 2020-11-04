<script>
	import { mapMutations } from "vuex";
	export default {
		methods: {
			...mapMutations(["setWs"]),
		},
		onLaunch: function() {
			console.log('App Launch');
			this.setWs(new WebSocket("ws://localhost:8080"));
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
