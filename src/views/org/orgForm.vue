<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    :before-close="handleClose">
    <div>
      <el-form ref="form" label-width="100px" v-bind:model="orgForm" :rules="rules">
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="orgForm.orgName"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import orgApi from '@/api/org/orgApi'

  export default {
    name: "orgForm",
    computed: {
      title() {
        return this.type == 'create' ? '添加组织机构' : '修改组织机构'
      }
    },
    watch: {
      visible: function (val) {
        if (this.type != 'create') {
          this.orgForm = this.orgInfo
        }
        if (!val) {
          this.$emit("update:visible", false)
          this.orgForm = {
            orgName: null,
            id: null
          }
          this.onOk
          this.$refs["form"].resetFields()
        }
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: null
      },
      type: {
        type: String,
        default: 'modifyOrg'
      },
      orgInfo: {},
      onOk: {
        type: Function
      }
    },

    data() {
      return {
        rules: {
          orgName: [
            {required: true, trigger: "change", message: "请输入组织机构名称!"}
          ],
          id: [
            {required: true, trigger: "change", message: "请输入部门id!"}
          ]
        },
        orgForm: {
          orgName: null,
          id: null
        }
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      //保存用户填入信息
      save() {
        this.$refs["form"].validate(async (valid) => {
          let result = null
          if (valid) {
            if (this.type == 'create') {
              this.orgForm['superOrgId'] = this.orgInfo.id
              result = await orgApi.createOrg(this.orgForm)
              this.onOk()
            } else {
              this.orgForm['id'] = this.orgInfo.id
              this.orgForm = JSON.parse(JSON.stringify(this.orgForm))
              result = await orgApi.modifyOrg(this.orgForm)
              result['state'] = result.data.state
              this.onOk()
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
        this.visible = false
      }
    }
  };
</script>

<style scoped>

</style>
