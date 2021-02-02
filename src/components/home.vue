<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="danger" @click="outLogin">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapseFlag ? '64px' : '200px'">
        <div class="hidden" @click="hiddenHandle">||||</div>
        <!-- 菜单栏 -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#7fffd4"
          :collapse="collapseFlag"
          :collapse-transition="false"
          unique-opened
          router
          :default-active="activePath">
          <!-- 一级菜单项 -->
          <el-submenu :index="item.id + ''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i :class="listId[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="menuItem in item.children" :key="menuItem.id" :index="'/' + menuItem.path" @click="setPath('/' + menuItem.path)">
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{menuItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      listId: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-3702mima',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-tijikongjian'
      },
      collapseFlag: false,
      activePath: ''
    }
  },
  created () {
    this.getlist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    outLogin () {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    async getlist () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.list = res.data
      // console.log(res)
      // console.log(this.list)
    },
    hiddenHandle () {
      this.collapseFlag = !this.collapseFlag
    },
    setPath (path) {
      window.sessionStorage.setItem('activePath', path)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: #363d40;
  div {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #fff;
    img {
      width: 40px;
      height: 40px;
      padding: 10px;
    }
  }
}

.el-aside {
  background-color: #313743;
  .hidden {
    height: 30px;
    line-height: 30px;
    letter-spacing: 3px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
  .el-menu {
    border: none;
  }
  .iconfont {
    margin-right: 10px;
  }
}
</style>
