<template>
  <div>
    <el-container>
      <el-header class="el-header">
        <el-col class="logo">
          vue-信息管理系统
          <el-dropdown trigger="hover" class="el-dropdown">
            <i class="el-icon-setting">
              <span class="userinfo-inner">{{sysUserName}}</span>
            </i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>

      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router
                   background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#ffd04b"
                   class="el-menu">
            <el-menu-item index="/home/user">用户列表</el-menu-item>
            <el-menu-item index="/home/org">组织列表</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        sysUserName: '',
      }
    },
    methods: {
      // 退出登录
      logout: function () {
        let _this = this
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          sessionStorage.removeItem('username')
          _this.$router.push('/login')
        }).catch(() => {
        })
      }
    },
  }
</script>
<style>
  .el-header {
    background: rgb(215, 241, 249);
  }
  .el-dropdown {
    float: right;
    margin-right: 30px;
    cursor: pointer;
  }
  .userinfo-inner {
    margin-left: 5px;
  }
  .el-menu {
    height: 580px;
    text-align: center
  }
  .router-link {
    text-decoration: none;
    color: #fff;
  }
  .logo {
    height: 60px;
    line-height: 60px;
    font-size: 22px;
  }
</style>
