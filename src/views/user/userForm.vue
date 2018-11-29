<!--sync后缀修饰符修饰的为同步对象-->
<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="600px"
  >
    <div>
      <el-form ref="form" label-width="100px" v-bind:model="userForm" :rules="rules">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="type=='create'">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="就职部门">
          <div class="block">
            <span class="demonstration"></span>
            <el-cascader
              :placeholder="text"
              :change-on-select="true"
              :show-all-levels="false"
              :options="options"
              :props="defaultProps"
              v-model="selectedOptions"
              @change="handleChange"
              @visible-change="queryOrgInfo">
            </el-cascader>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import userApi from '@/api/user/userApi'
  import orgApi from '@/api/org/orgApi'

  export default {
    name: "userForm",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      type: {},
      user: {},
      orgId: {},
      orgName: {}
    },
    computed: {
      title() {
        return this.type === 'create' ? '新增用户' : '修改用户'
      }
    }, mounted() {
      this.checkRoute()
    },
    watch: {
      visible: function (val) {
        if (this.type != 'create') {
          this.userForm = this.user
        }
        if (!val) {
          this.$emit("update:visible", false)
          this.userForm = {
            userName: null,
            orgId: null,
            password: null,
          }
          this.$refs["form"].resetFields()
        }
      },
    },
    data: function () {
      return {
        text: '请选择部门',
        flagForCreate: true,
        options: [],
        defaultProps: {children: 'childrens', label: 'orgName', value: 'id'},
        selectedOptions: [],
        rules: {
          userName: [
            {required: true, trigger: "change", message: "请输入姓名!"}
          ],
          password: [
            {required: true, trigger: "change", message: "请输入密码!"}
          ],
        },
        userForm: {
          userName: null,
          orgId: null,
          password: null,
          id: null,
        },
        result: null,
      }
    },
    methods: {
      //处理级联的点击事件，获取選中的组织机构id
      handleChange(value) {
        this.flagForCreate = false
        this.userForm.orgId = value[value.length - 1]
      },
      //为级联初始化组织机构数据数据
      async queryOrgInfo(val) {
        if (val) {
          let result = await orgApi.queryOrgs()
          this.options = result
        }

      },
      //判断当前页面路由，如果是将orgId设为null
      checkRoute: function () {
        let val = this.$route.path
        if (val == '/user') {
          this.orgId = null
        }
      },
      //保存用户填入的数据，进行添加或修改
      save() {
        this.$refs["form"].validate(async (valid) => {
          let result = null
          let val = this.$route.path
          if (valid) {
            if (this.type ==='create') {
              alert(this.flagForCreate)
              if (val != '/user' && this.flagForCreate) {
                this.userForm['orgId'] = this.orgId
                this.flagForCreate = true
              }
              result = await userApi.createUser(this.userForm)
            } else {
              this.userForm['id'] = this.user.id
              this.userForm = JSON.parse(JSON.stringify(this.userForm))
              result = await userApi.modifyUser(this.userForm)

            }
            this.$emit("update:visible", false)
            this.$emit("success")
            if (result.state === 1) {
              this.$message({
                message: this.type == "create" ? "添加成功!" : "修改成功!",
                type: "success"
              })
            } else {
              this.$message({
                message: this.type == "create" ? "添加失败!" : "修改失败!",
                type: 'error'
              })
            }

          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
