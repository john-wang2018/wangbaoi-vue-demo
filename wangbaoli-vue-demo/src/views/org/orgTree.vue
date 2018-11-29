<template>
    <el-container>
      <el-aside width="330px">
        <el-tree :data="data" :props="defaultProps" @node-click="handleClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="info" circle icon="el-icon-plus"
            size="mini"
            @click="openOrgDialog('create',node,data)">
          </el-button>
          <el-button
            type="danger" icon="el-icon-delete" circle
            size="mini"
            @click="deleteOrg(data)"
          >
          </el-button>
          <el-button
            type="primary" icon="el-icon-edit" circle
            size="mini"
            @click="openOrgDialog('modify',node, data)"
          >
          </el-button>
        </span>
      </span></el-tree>
      </el-aside>
      <el-main>
        <user ref="user"></user>
        <orgForm :visible.sync="visible" :title="title" :type="type" :orgInfo="orgInfo" :onOk="loadData"></orgForm>
      </el-main>
    </el-container>
</template>

<script>
  import orgApi from '@/api/org/orgApi'
  import orgForm from './orgForm.vue'
  import user from '@/views/user/userList.vue'

  export default {
    components: {orgForm, user},
    name: "orgTree",
    data() {
      return {
        orgInfo: {
          orgName: null,
          id: null
        },
        type: 'modifyOrg',
        title: null,
        visible: false,
        org: {},
        type: null,
        data: [],
        defaultProps: {
          children: 'childrens',
          label: 'orgName'
        }
      };
    }, mounted: function () {
      this.loadData()

    },
    watch: {
      'tableData': 'initUser'

    },
    methods: {
      //加载组织机构数据
      async loadData() {
        let result = await orgApi.queryOrgs()
        this.data = result
        console.log('result')
        console.log(result)
        this.tableData = result
        this.initUser()
      },
      //初始化user组件数据
      initUser: function () {
        this.$refs.user.orgId = this.tableData[0].id
        this.$nextTick(
          this.$refs.user.getUsers()
        )
      },
      //处理树节点点击事件，完成改组织机构下用户数据的加载
      handleClick: function (data) {
        console.log("data")
        console.log(data)
        this.$store.commit('changeType','')
        this.$refs.user.orgId = data.id
        this.$refs.user.getUsers()
      },
      //打开组织机构信息弹窗，进行数据修改或添加用户。
      openOrgDialog(type, node, data) {
        this.orgInfo = data
        if (type == 'create') {
          this.type = type
        } else {
          this.type = type
        }
        this.visible = true
      },
      //删除组织机构，如果部存在下级机构则删除，存在则不删除。
      async deleteOrg(data) {
        if (confirm("确定删除该组织机构吗？") != true) {
          return
        }
        if (data.childrens != null) {
          this.$message({
            message: "删除失败！目标存在下级机构！",
            type: "error"
          })
          return
        }
        let result = await orgApi.removeOrg(data.id)
        result['state'] = result.data.state
        if (result.state == '1') {
          this.$message({
            message: "删除成功！",
            type: "success"
          })

        } else {
          this.$message({
            message: "删除失败！",
            type: "error"
          })
        }
        this.loadData()
      }

    }
  }
</script>

<style scoped>
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
