<template>

  <el-form ref='AccountFrom' :model='account' :rules='rules' lable-position='left' lable-width='0px'
           class='demo-ruleForm login-container'>
    <h3 class="title">登录系统首页</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="account.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="userPassword">
      <el-input type="password" v-model="account.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent='actionLogin' :loading='logining'>登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  //引入api.js  好调用里面的接口
  import userApi from '@/api/user/userApi';

  export default {
    name: 'login',
    data() {
      return {
        result: {},
        logining: false,
        account: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        },
        checked: true
      }
    },

    methods: {
      actionLogin() {
        this.$refs.AccountFrom.validate(async (valid) => {

          if (valid) {
            //验证通过 可以提交
            this.logining = true;
            await userApi.actionLogin(this.account).then(data => {
              this.result = data
              this.logining = false;
              if (data.state == 1) {
                console.log("状态码：" + data.code)
                //登录成功
                //用vue路由跳转到后台主界面
                this.$router.push({path: '/home'});
              } else {
                this.$message({
                  message: data.message,
                  type: 'error'
                });
              }
            })

          } else {
            console.log('error submit');
            return false;
          }
        });
      }
    }
  }
</script>

<style>
  body {
    background: #DFE9FB;
  }

  .login-container {
    width: 350px;
    margin-left: 35%;
  }
</style>
