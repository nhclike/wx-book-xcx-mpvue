<template>
  <div>
    <TopSwiper :tops="tops"></TopSwiper>
    <Card :key="item.id" v-for="(item,index) in books" :book="item"></Card>
    <p class='text-footer' v-if='!more'>
      没有更多数据
    </p>
  </div>
</template>
<script>
  // 35条数据
  // 每次加载10条
  // 0页   0-10
  // 1     10-20
  // 2     20-30（5）
  // page 当前第几页

  // 没有更多数据
  // 1. page=0 不能显示这条提醒
  // 2. page>0 数据长度<10 停止触底加载
  import {get} from "@/util"
  import Card from "@/components/card"
  import TopSwiper from "@/components/TopSwiper"
  export default {
    data() {
      return {
        books: [],
        page: 0,
        more: true,
        tops:[]
      }
    },
    components: {
      Card,
      TopSwiper
    },
    mounted() {
      this.getList(true);
      this.getTop()

    },
    methods: {
      async getList(init) {
        if (init) {
          this.page = 0;
          this.more = true
        }
        wx.showNavigationBarLoading();
        const books = await get("/weapp/booklist", {page: this.page});
        //console.log(books);
        if (books.list.length < 10 && this.page > 0) {
          this.more = false;
          //console.log(this.more)
        }
        if (init) {
          this.books = books.list;
          wx.stopPullDownRefresh()
        } else {
          // 下拉刷新，不能直接覆盖books 而是累加
          this.books = this.books.concat(books.list)
        }

        wx.hideNavigationBarLoading()
      },
      async getTop(){
        const tops = await get('/weapp/top');
        this.tops = tops.list
      }
    },
    //监听用户下拉动作
    onPullDownRefresh() {
      console.log("用户下拉刷新");
      this.getList(true);
      this.getTop()

    },
    onReachBottom() {
      console.log("滚动到底部了");
      if (!this.more) {
        // 没有更多了
        return false
      }
      this.page = this.page + 1;
      this.getList();
      this.getTop()
    }
  }

</script>
<style>


</style>
