import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import axios from 'axios'
import qs from 'qs'
Vue.config.productionTip = false
axios.defaults.baseURL = '/cm/'

axios.defaults.timeout = 60000 
axios.defaults.headers = {
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
}
axios.defaults.withCredentials = true 

Vue.prototype.$axios = axios

Vue.prototype.$msg = function (msg){
	alert(msg);
}
Vue.prototype.$err = function (msg){
	console.log(msg);
}
let headers={
			Accept: "application/x-www-form-urlencoded",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
		}

Vue.prototype.$get = function (url,para,call,error){
	url =url;
	let call1 = call || function(data){
		console.log(data);
	};
	let $this= this;
	let error1 =error || function(err){
		$this.$msg(err);
	}
	para = para || {};

	this.$axios({
    method: 'get', 
    withCredentials: true, 
    url:url, 
    params:para, 
  }).then(function(response) {
  	call1(response.data);
  }).catch( function(err) {
  	error1(err);
  });
}
Vue.prototype.$bodyH_t=61
Vue.prototype.$bodyH_l=20
const self = this
const tempH = `${document.documentElement.clientHeight}`-10
var tab= tempH-61
//if(tab<=400) tab=400
var l =tempH-20
//if(l<=441) l=441
Vue.prototype.$bodyHeightLeft=l
Vue.prototype.$bodyHeightTab=tab
Vue.prototype.$bodyHeight=tempH
window.onresize = () => {
	return (() => {
		/* const self = this
		self.$bodyHeight = `${document.documentElement.clientHeight}`;
		var h = self.$bodyHeight-self.$bodyH_t;
		if(h<=400) h=400;
		self.$bodyHeightTab = h;
		var v =self.$bodyHeight-self.$bodyH_l;
		if(v<=400) v=400;
		self.$bodyHeightLeft = v; */
		const self = this
		const tempH = `${document.documentElement.clientHeight}`-10
		var tab= tempH-61
		//if(tab<=400) tab=400
		var l =tempH-20
		//if(l<=441) l=441
		Vue.prototype.$bodyHeightLeft=l
		Vue.prototype.$bodyHeightTab=tab
		Vue.prototype.$bodyHeight=tempH
		
		console.log("init----",tempH);
	})();
};
Vue.prototype.$post = function (url,para,call,error){
	url =url;
	let call1 = call || function(data){
		console.log(data);
	};
	let error1 =error || function(err){
		console.log(err);
	}
	para = para || {};
	para= qs.stringify(para);
	this.$axios.post(url, para, {
		withCredentials:true 
	}).then(function(response) {
		call1(response.data);
	}).catch( function(err) {
		 error1(err);
	});


}
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
