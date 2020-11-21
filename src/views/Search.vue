<template>
  <div class="search">
    <van-nav-bar left-arrow :fixed="true" @click-left="back">
      <template #right>
        <div class="input-box">
          <i class="fl van-icon van-icon-search inp-icon"></i>
          <input
            placeholder="请输入商品名称"
            class="fl inp"
            type="text"
            ref="myInput"
            v-model="value"
            @input="getsearch"
          />
        </div>
      </template>
    </van-nav-bar>

    <div class="search-bg" v-if="searchProducts.length > 0"></div>

    <div class="product-box clearfix" v-if="searchProducts.length > 0">
      <div
        class="product-item fl"
        :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
        v-for="(item, index) in searchProducts"
        :key="index"
      >
        <div class="p-img" @click="viewProductInfo(item.pid)">
          <img class="auto-img" :src="item.smallImg" alt="" />
        </div>
        <div class="pro-name one-text">{{ item.name }}</div>
        <div class="clearfix">
          <!-- <div class="en-pro-name one-text fl">heitangbobo</div> -->
          <div class="pro-price fl">￥{{ item.price }}</div>
        </div>
      </div>
    </div>

    <div v-else>
      <van-empty description="没有你要的搜索商品,请输入正确名字!">
        <!-- <van-button round color="#0C34BA" class="bottom-button" @click="goMenu"
          >搜索一下</van-button
        > -->
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../assets/less/search.less";

export default {
  data() {
    return {
      value: "",
      searchProducts: [],
    };
  },
  created() {},
  mounted() {
     
    this.$refs.myInput.focus();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    //请求搜索数据
    getsearch(e) {
      let value = e.target.value;
       

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/search",
        //如果get请求，参数需要放在params，如果是post请求，参数需要放在data里面
        params: {
          appkey: this.appkey,
          name: value,
        },
      })
        .then((result) => {
          this.searchProducts = [];
          this.$toast.clear();
           
          if (result.data.code == "Q001") {
            //商品存在
            if (result.data.result.length > 0) {
              this.searchProducts = result.data.result;
            }
          }

           
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //查看商品详情
    viewProductInfo(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
  },
};
</script>