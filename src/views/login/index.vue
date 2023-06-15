<template>
  <div class="app">
    <el-card class="login-page">
      <template #header> 黑马面经运营后台 </template>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="tc">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { login } from "@/api/user.js";
export default {
  name: "LoginIndex",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["blur", "change"],
          },
          {
            min: 5,
            max: 10,
            message: "请输入 5 到 10 位的用户名",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^\w{5,11}$/,
            message: "请输入 5 到 10 位的密码",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res = await login(this.form);
            console.log(res.data.token, "token");
            this.$store.commit("user/setUserToken", res.data.token);
            this.$router.push("/"); // 跳转到首页
          } catch (error) {
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
    reset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.app {
  // display: flex;
  // margin-top: 100px;
  // justify-content: center;
  // align-items: center;

  min-height: 100vh;
  background: url(@/assets/login-bg.svg) no-repeat 50% / cover;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .login-page {
    width: 420px;
    ::v-deep .el-card__header {
      color: white;
      background-color: #727cf4;
      text-align: center;
    }
    .tc {
      text-align: center;
    }
  }
}
</style>
