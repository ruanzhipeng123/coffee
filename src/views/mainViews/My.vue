<template>
  <div class="my">
    <div class="my-bg" :style="{ backgroundImage: `url(${userInfo.userBg})` }">
      <van-uploader class="uploader-box" :after-read="upload" />
    </div>

    <div class="my-content">
      <div class="my-boxing">
        <div v-if="isLogin" class="my-box">
          <div class="my-img">
            <div class="img-box">
              <img class="auto-img" :src="userInfo.userImg" alt="" />
            </div>
            <div class="my-info">
              <div class="nickname">{{ userInfo.nickName }}</div>
              <div class="desc">
                {{
                  userInfo.desc == ""
                    ? "这个家伙很懒，什么都没留下"
                    : userInfo.desc
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="not-login" v-else>
          <span @click="goLogin">请先登录</span>
        </div>

        <div class="lists">
          <div class="lists-border" v-for="(item, index) in lists" :key="index">
            <van-cell :title="item.title" :to="item.to" size="large" is-link />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/my.less";
import { utils } from "../../assets/js/utils";

export default {
  data() {
    return {
      lists: [
        { title: "个人资料", to: { name: "Account" } },
        { title: "我的订单", to: { name: "Order" } },
        { title: "我的收藏", to: { name: "Like" } },
        { title: "收货地址", to: { name: "Address" } },
        { title: "安全中心", to: { name: "Secure" } },
      ],
      isLogin: false,
      userInfo: {},
      maxSize: 1 * 1024 * 800,
    };
  },

  created() {
    //查询用户信息
    this.getUserInfo();
  },

  methods: {
    goLogin() {
      this.$router.push({ name: "Login" });
    },

    //查询用户信息
    getUserInfo() {
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
        url: "/findMy",
        //如果get请求，参数需要放在params，如果是post请求，参数需要放在data里面
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
           
          if (result.data.code == "A001") {
            if (result.data.result.length > 0) {
              this.isLogin = true;
              this.userInfo = result.data.result[0];
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },

    //上传背景
    upload(file) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //获取文件类型
      let type = file.file.type.split("/")[1];
      let imgTypes = ["png", "gif", "jpg", "jpeg"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#0C34BA",
        });

        return;
      }

      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0C34BA",
        });

        return;
      }
       

      //获取base64
      let base64 = file.content.replace(/data:image\/[A-Z-a-z]+;base64/, "");

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        imgType: type,
        serverBase64Img: base64,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        //如果get请求，参数需要放在params，如果是post请求，参数需要放在data里面
        data,
      })
        .then((result) => {
          this.$toast.clear();
           
          if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>