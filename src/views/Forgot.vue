<template>
  <div class="forgot-box">
    <div class="login-box">
      <van-nav-bar @click-right="goPage('Home')">
        <template #left>
          <div class="left-text">
            <div class="logo">
              <img
                class="auto-img"
                src="../assets/images/coffee-icon_02.png"
                alt=""
              />
            </div>
            <div class="logo-title">Luckin Coffee</div>
          </div>
        </template>
        <template #right>
          <div class="close-box">先逛一逛</div>
        </template>
      </van-nav-bar>
      <div class="login-form">
        <div class="title">忘记密码!</div>
        <div class="en-title">forgot password</div>
        <div class="login-form-box">
          <van-form>
            <van-field
              label="手机号"
              placeholder="手机号"
              v-model="userInfo.phone"
            />
            <van-field
              :type="isPassword ? 'password' : 'text'"
              label="密码"
              placeholder="密码"
              v-model="userInfo.password"
              :right-icon="isPassword ? 'eye-o' : 'closed-eye'"
              @click-right-icon="viewPassword"
            />
            <van-field
              label="邮箱"
              placeholder="邮箱"
              v-model="userInfo.email"
            />
            <van-field
              v-model="userInfo.validCode"
              center
              clearable
              label="邮箱验证码"
              placeholder="请输入邮箱验证码"
            >
              <template #button>
                <van-button
                  size="small"
                  color="#0C34BA"
                  :disabled="isSend"
                  @click="sendValidCode"
                  >{{ text }}</van-button
                >
              </template>
            </van-field>
            <div class="clearfix forgot">
              <span class="fr" @click="goPage('Login')"
                >已有账号，立即登录</span
              >
            </div>
            <div class="login-btn">
              <van-button
                round
                block
                native-type="submit"
                color="#0C34BA"
                @click="commit"
                >提&nbsp;&nbsp;交</van-button
              >
            </div>
          </van-form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import "../assets/less/forgot.less";

import { validForm } from "../assets/js/validForm";

import { utils } from "../assets/js/utils";

export default {
  data() {
    return {
      userInfo: {
        phone: "",
        password: "",
        email: "",
        validCode: "",
      },
      isPassword: true,
      text: "发送验证码",
      isSend: false,
    };
  },

  methods: {
    goPage(name) {
      this.$router.push({ name });
    },

    //查看密码
    viewPassword() {
      this.isPassword = !this.isPassword;
    },

    //发送验证码
    sendValidCode() {
      let time = 5;
      this.text = time + "s后重新发送";
      this.isSend = true;

      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.isSend = false;
          this.text = "发送验证码";
        } else {
          time--;
          this.text = time + "s后重新发送";
        }
      }, 1000);

      //发起获取邮箱验证码请求
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //参数序列化
      let data = utils.queryString({
        email: this.userInfo.email,
        appkey: this.appkey,
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data,
      })
        .then((result) => {
          this.$toast.clear();
           

          this.$notify({
            type: "warning",
            message: result.data.msg,
          });
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },

    //提交
    commit() {
      //验证修改密码表单
      let o = {
        phone: {
          value: this.userInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: this.userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合",
        },
        email: {
          value: this.userInfo.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱格式不正确",
        },
        validCode: {
          value: this.userInfo.validCode,
          reg: /^\d{6}$/,
          errorMsg: "验证码为6为数字",
        },
      };

      if (!validForm.valid(o)) {
        //验证不通过
        return;
      }

      //发起忘记密码请求
       
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //参数序列化
      let data = utils.queryString({
        validCode: this.userInfo.validCode,
        appkey: this.appkey,
      });

      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data,
      })
        .then((result) => {
          this.$toast.clear();
           
          if (result.data.code == "K001") {
            //验证成功
            this.updatePassword()
          } else {
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },

    //修改密码
    updatePassword() {
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //参数序列化
      let data = utils.queryString({
        phone: this.userInfo.phone,
        password: this.userInfo.password,
        appkey: this.appkey,
      });

      this.axios({
        method: "POST",
        url: "/retrievePassword",
        data,
      })
        .then((result) => {
          this.$toast.clear();
           

          if (result.data.code == 'L001') {
              this.$router.push({name: 'Login'})
          } else {
              this.$toast(result.data.msg)
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },
  },
};
</script>