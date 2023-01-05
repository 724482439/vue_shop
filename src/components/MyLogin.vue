<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单区 -->
      <!-- ref:为了获得表单的实例对象 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyLogin",
  data() {
    return {
      // 表单数据
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单---表单函数resetFields()
    resetLoginForm() {
      // this.$refs.子组件名称----获取子组件
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录按钮，对表单进行预校验---表单函数validate((预校验结果布尔值)=>{回调函数})
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 预校验失败，则返回
        if (!valid) return;
        // 预校验成功，发送post请求
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error("登录失败！");
        this.$message({
          message: "登录成功",
          type: "success",
        });
        // 登录成功后，将token保存到客户端的sessionStorage中，token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style scoped lang="less">
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  // less语法可以嵌套
  .avatar_box {
    position: absolute;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 让盒子模型自动调整padding和margin，不改变盒子的宽度和高度
  box-sizing: border-box;
}
.btns {
  display: flex;
  // 居右对齐
  justify-content: flex-end;
}
</style>