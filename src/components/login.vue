<template>
  <div class="container">
    <div class="login_container">
      <div class="avatar_container">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form ref="FormRef" :model="loginForm" :rules="loginRules" class="input_container" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="button_container">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      // console.log(this.$refs.FormRef)
      this.$refs.FormRef.resetFields()
    },
    login () {
      this.$refs.FormRef.validate(flag => {
        // console.log(this)
        if (!flag) return false
        this.$http.post('login', this.loginForm).then(data => {
          // console.log(data)
          if (data.data.meta.status !== 200) {
            this.$message.error('登录失败')
          } else {
            const token = data.data.data.token
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', token)
            this.$router.push('/home')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  background-color: aquamarine;
}

.login_container {
  position: absolute;
  width: 450px;
  height: 300px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  .avatar_container {
    position: absolute;
    width: 100px;
    height: 100px;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #eee;
    border-radius: 50%;
    background-color: #fff;
    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .input_container {
      position: absolute;
      top: 80px;
      left: 50px;
      .button_container {
          float: right;
      }
  }
}
</style>
