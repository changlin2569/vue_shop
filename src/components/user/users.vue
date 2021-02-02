/* eslint-disable vue/valid-template-root */
<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-input
        placeholder="请输入内容"
        v-model="paramsUser.query"
        @change="searchUser"
        @clear="searchUser"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchUser"
        ></el-button>
      </el-input>
      <el-button type="primary" @click="dialogVisible = true"
        >添加用户</el-button
      >
      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="resetUserForm"
      >
        <el-form
          :model="userForm"
          :rules="userFormRule"
          ref="userFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户列表 -->
      <el-table :data="usersData" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template v-slot:default="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="toggleSwitch(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="handle" label="操作" width="180">
          <template v-slot:default="slotProps">
            <!-- 修改角色 -->
            <el-button
              @click="trimUser(slotProps.row.id)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
              ></el-button>
            </el-tooltip>
            <!-- 删除角色 -->
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsUser.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="paramsUser.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalUsers"
      >
      </el-pagination>
    </el-card>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="trimUserVisible" @close="resetTrimUser" width="50%">
      <!-- 修改用户表单 -->
      <el-form
        :model="trimUserForm"
        :rules="userFormRule"
        ref="trimUserRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="trimUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="trimUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="trimUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="trimUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTrimUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      const emailRef = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (emailRef.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确格式的邮箱'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const mobileRef = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (mobileRef.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确格式的手机号码'))
      }
    }
    return {
      // 请求用户列表参数
      paramsUser: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前一页显示条数
        pagesize: 2
      },
      usersData: [],
      totalUsers: 0,
      // 控制添加用户对话框
      dialogVisible: false,
      // 添加用户数据
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userFormRule: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 6,
            message: '长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 11,
            message: '长度在 6 到 11 个字符',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框
      trimUserVisible: false,
      // 查询用户数据
      trimUserForm: {}
    }
  },
  created () {
    this.getUsersData()
  },
  methods: {
    // 获取用户列表数据
    async getUsersData () {
      const { data: res } = await this.$http.get('users', {
        params: this.paramsUser
      })
      // console.log(res)
      //   this.pagenum = res.data.pagenum
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.totalUsers = res.data.total
      this.usersData = res.data.users
    },
    // 显示条数改变事件
    handleSizeChange (sizeChange) {
      // console.log(sizeChange)
      this.paramsUser.pagesize = sizeChange
      this.getUsersData()
    },
    // 当前页码改变事件
    handleCurrentChange (currentSize) {
      // console.log(currentSize)
      this.paramsUser.pagenum = currentSize
      this.getUsersData()
    },
    // 角色状态改变事件
    async toggleSwitch (switchRole) {
      // console.log(switchRole)
      const { data: res } = await this.$http.put(
        `users/${switchRole.id}/state/${switchRole.mg_state}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        return this.$message.success(res.meta.msg)
      }
    },
    // 搜索角色
    searchUser () {
      this.getUsersData()
    },
    // 关闭对话框时重置添加用户表单的验证规则
    resetUserForm () {
      this.$refs.userFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.userFormRef.validate(async (addFlag) => {
        // console.log(addFlag)
        if (addFlag) {
          const { data: res } = await this.$http.post('users', this.userForm)
          if (res.meta.status === 201) {
            this.$message.success(`${res.meta.msg}`)
            // 关闭对话框
            this.dialogVisible = false
            // 用户创建成功，重新获取用户列表
            this.getUsersData()
          } else {
            this.$message(`${res.meta.msg}`)
          }
        } else {
          this.$message.error('用户添加失败')
        }
      })
    },
    async trimUser (id) {
      // console.log(id)
      this.trimUserVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      // console.log(res)
      if (res.meta.status === 200) {
        this.trimUserForm = res.data
        // this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
        return false
      }
    },
    // 关闭对话框时重置修改用户表单的验证规则
    resetTrimUser () {
      this.$refs.trimUserRef.resetFields()
    },
    // 提交修改角色
    addTrimUser () {
      // console.log(this.trimUserForm)
      this.$refs.trimUserRef.validate(async trimFlag => {
        if (trimFlag) {
          const { data: res } = await this.$http.put(`users/${this.trimUserForm.id}`, {
            email: this.trimUserForm.email,
            mobile: this.trimUserForm.mobile
          })
          if (res.meta.status === 200) {
            this.trimUserVisible = false
            this.getUsersData()
            this.$message.success(res.meta.msg)
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('修改提交失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
  margin-right: 20px;
}
</style>
