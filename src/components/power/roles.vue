<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table
        :data="roleList"
        border
        style="width: 100%; margin-top: 20px"
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="roleProps">
            <el-row
              v-for="(item1, i1) in roleProps.row.children"
              :key="item1.id"
              :class="['rowBottom', 'rowCenter', i1 === 0 ? 'rowTop' : '']"
            >
              <!-- 第一层权限 -->
              <el-col :span="6">
                <el-tag
                  @close="deleteRights(roleProps.row, item1.id)"
                  closable
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二层权限 -->
              <el-col :span="18">
                <el-row
                  :class="['rowCenter', i2 === 0 ? '' : 'rowTop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      @close="deleteRights(roleProps.row, item2.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="deleteRights(roleProps.row, item3.id)"
                      closable
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 角色信息列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="roleProps">
            <el-button type="primary" icon="el-icon-edit" @click="editRolesDialog(roleProps.row)" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="deleteRole(roleProps.row)"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-setting"
            @click="setRightsDialog(roleProps.row)"
            size="mini"
            >分配权限</el-button
          >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
    >
      <el-tree :data="roleRightsList" :props="roleRightsProps" node-key="id" :default-checked-keys="defaultKeys" ref="treeRef" default-expand-all show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
  title="添加角色"
  @close="resetAddFields"
  :visible.sync="addRolesDialogVisible">
  <el-form ref="addRolesFormRef" :model="addRolesInfo" :rules="addRolesRules" label-width="80px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRolesInfo.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述">
    <el-input v-model="addRolesInfo.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRolesHandle">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑角色对话框 -->
<el-dialog
  title="编辑角色"
  @close="resetEditFields"
  :visible.sync="editRolesDialogVisible">
  <el-form ref="editRolesFormRef" :model="addRolesInfo" :rules="addRolesRules" label-width="80px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRolesInfo.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述">
    <el-input v-model="addRolesInfo.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolesHandle">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表
      roleList: [],
      setRightsDialogVisible: false,
      // 角色权限数据
      roleRightsList: [],
      roleRightsProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中权限
      defaultKeys: [],
      // 分配角色权限id
      roleId: '',
      // 控制添加角色对话框
      addRolesDialogVisible: false,
      // 添加角色信息
      addRolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色验证规则
      addRolesRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }]
      },
      // 控制编辑角色对话框
      editRolesDialogVisible: false
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    //   获取角色列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      //   console.log(res)
      if (res.meta.status === 200) {
        this.roleList = res.data
        // this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 删除角色指定权限
    deleteRights (role, rightId) {
      this.$confirm('此操作将删除角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(role.id, rightId)
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status === 200) {
          role.children = res.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message.error(res.meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配角色权限
    async setRightsDialog (role) {
      this.defaultKeys = []
      this.roleId = role.id
      // console.log(this.roleId)
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status === 200) {
        this.roleRightsList = res.data
        // console.log(role)
        this.getLeafKeys(role, this.defaultKeys)
      } else {
        this.$message.error(res.meta.msg)
      }
      this.setRightsDialogVisible = true
    },
    // 递归获得三级权限id
    getLeafKeys (node, arr) {
      if (node.children) {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      } else {
        return arr.push(node.id)
      }
      // console.log(arr)
    },
    // 角色授权提交
    async allotRights () {
      const keyArr = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedNodes()]
      // console.log(keyArr)
      const keyStr = keyArr.join()
      // console.log(this.roleId)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: keyStr
      })
      if (res.meta.status === 200) {
        // console.log()
        this.getRoleList()
        this.setRightsDialogVisible = false
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 重置验证结果
    resetAddFields () {
      this.$refs.addRolesFormRef.resetFields()
      this.addRolesInfo = {}
    },
    // 添加角色对话框
    addRoles () {
      this.addRolesDialogVisible = true
    },
    // 确定添加角色
    addRolesHandle () {
      this.$refs.addRolesFormRef.validate(async addRolesFlag => {
        // console.log(addRolesFlag)
        if (addRolesFlag) {
          const { data: res } = await this.$http.post('roles', this.addRolesInfo)
          if (res.meta.status === 201) {
            this.getRoleList()
            this.$message.success(res.meta.msg)
          } else {
            return this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('校验未通过')
        }
      })
      this.addRolesDialogVisible = false
    },
    // 根据查询角色信息
    async getRolesInfo (id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      // console.log(res)
      if (res.meta.status === 200) {
        this.addRolesInfo = res.data
      } else {
        return this.$message.error(res.meta.msg)
      }
    },
    // 编辑角色对话框
    editRolesDialog (role) {
      this.getRolesInfo(role.id)
      this.roleId = role.id
      // console.log(this.addRolesInfo)
      this.editRolesDialogVisible = true
    },
    // 提交编辑角色
    editRolesHandle () {
      this.$refs.editRolesFormRef.validate(async editRolesFlag => {
        // console.log(editRolesFlag)
        if (editRolesFlag) {
          const { data: res } = await this.$http.put(`roles/${this.roleId}`, this.addRolesInfo)
          if (res.meta.status === 200) {
            this.getRoleList()
            this.$message.success('编辑成功')
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          return this.$message.error('编辑失败')
        }
      })
      this.editRolesDialogVisible = false
      // console.log(this)
    },
    resetEditFields () {
      this.$refs.editRolesFormRef.resetFields()
      this.addRolesInfo = {}
    },
    // 删除角色
    deleteRole (role) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}`)
        if (res.meta.status === 200) {
          this.getRoleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message.error(res.meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.rowBottom {
  border-bottom: 1px solid #eee;
}

.rowTop {
  border-top: 1px solid #eee;
}

.rowCenter {
  display: flex;
  align-items: center;
}
</style>
