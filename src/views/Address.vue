<template>
  <div class="my-address">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="back"
    />
    <div class="address-bg"></div>
    <div class="address-box">
      <div v-if="list.length > 0">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="newAddress"
          @edit="editAddress"
        />
      </div>

      <div v-else>
        <van-empty description="地址空空如也，去新增地址">
          <van-button round color="#0C34BA" class="bottom-button" @click="newAddress"
          >去新增地址</van-button
        >
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/address.less";

export default {
  data() {
    return {
      //选择地址的id
      chosenAddressId: "1",
      //地址列表数据
      list: [],
    };
  },

  created() {
    // 查询收货地址
    this.getReceiveAddress();
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },


    //查询收货地址
    getReceiveAddress() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
        //如果get请求，参数需要放在params，如果是post请求，参数需要放在data里面
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
           
          if (result.data.code == 20000) {
            result.data.result.map((v) => {
              let address = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address,
                isDefault: Boolean(v.isDefault),
              });
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    //编辑地址
    editAddress(item) {
       
      this.$router.push({ name: "NewAddress", query: { aid: item.id } });
    },
  },
};
</script>