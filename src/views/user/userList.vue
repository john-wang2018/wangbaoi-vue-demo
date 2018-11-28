<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input
            @clear="function(){$store.commit('changeType','');getUsers()}"
            placeholder="请输入内容"
            v-model="userName"
            clearable>
          </el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-button type="primary" @click="searchUsers" icon="el-icon-search">Search</el-button>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="openUserDialog('create','')">Create</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
      align="center">
      <el-table-column v-if="false"
                       prop="id"
                       label="员工id"
                       width="180">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="org[orgName]"
        label="组织部门"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-button @click="removeUser(scope.row)" type="danger" icon="el-icon-delete" circle
                           size="mini"></el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-button @click="openUserDialog('modify',scope.row)" type="primary" icon="el-icon-edit" circle
                           size="mini"></el-button>
              </div>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
    </el-table>
    <Form :visible.sync="visible" :title="title" :type="type" :user="user" :orgId="orgId" :orgName="orgName" @success="getUsers"></Form>
    <div class="block">
      <el-pagination
        layout="prev,pager,next"
        :page-size="query.size"
        :total="total"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import userApi from '@/api/user/userApi'
  import Form from './userForm.vue'

  export default {

    name: "userList",
    props:{
    },
    components: {Form},
    data() {
      return {
        type:null,
        userName:null,
        orgId: null,
        orgName:null,
        tableData: [],
        visible: false,
        visible_modify: false,
        type: 'modify',
        title: '',
        user: {},
        total: 10,
        query: {
          orgId: null,
          pageIndex: 1,
          size: 8
        }
      }
    },
    mounted() {
      this.checkRoute()
    },
    watch: {
      'orgId': 'getUsers'
    },
    methods: {
      //检查路由，确保正确调用在某个组织中的数据
      checkRoute: function () {
        let val = this.$route.path
        if (val == '/user') {
          this.getUsers()
        }
      },
      //根据页面及调用本方法的对象的到用户数据
      async getUsers() {
        this.tableData = null
        let val = this.$route.path
        let result = null
        if (this.$store.state.type== 'search') {
          if(this.userName!='null' || this.userName != ''){
            result = await userApi.queryUsersByUserName(this.userName)
          }else{
            result = await userApi.pageIng(this.query)
          }
        } else if (val != '/user') {
          this.query.orgId = this.orgId
          result = await userApi.pageIngByOrgId(this.query)
        } else {
          result = await userApi.pageIng(this.query)
        }
        this.tableData = result.data.list
        this.total = result.data.total
        for (let i = 0; i < this.tableData.length; i++) {
          try {
            this.tableData[i].org.orgName
          } catch (e) {
            this.tableData[i].org = {"orgName": "无"}
          }
        }
      },
      //打开弹窗
      openUserDialog(type, userInfo) {
        this.$store.commit('changeType','')
        if (type!= 'create')
          userInfo.orgId = userInfo.org.id
        this.type = type
        this.user= userInfo
        this.visible = true
      },
      async removeUser(row) {
        if (confirm("确定删除该用户吗？") != true) {
          return
        }
        //删除用户
        await userApi.removeUser(row.id).then(() => {
          this.$message({
            message: "删除成功!",
            type: "success"
          })
          this.getUsers()
        }).catch((result) => {
          this.$message({
            message: result.message,
            type: "error"
          })
        })
      },
      //页码改变时的操作
      async changePage(pageIndex) {
        this.query.pageIndex = pageIndex
        this.getUsers();
      },
      //根据用户名查询用户信息的条件设置
      searchUsers(){
        this.$store.commit('changeType','search')
        this.getUsers()
      },
    }
  }
</script>

<style scoped>
  body {
    background: #DFE9FB;
  }
</style>
