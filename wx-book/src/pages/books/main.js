import Vue from 'vue'
import App from './book'

// add this to handle exception
Vue.config.errorHandler = function (err) {
  if (console && console.error) {
    console.error(err)
  }
};

const app = new Vue(App);
app.$mount();

export default{
  config:{
    enablePullDownRefresh:true  //设置开启下拉刷新
  }
}