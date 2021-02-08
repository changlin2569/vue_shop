<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 级联选择器 -->
      <div>
        <span>选择商品分类：</span>
        <el-cascader
          v-model="selectedKeys"
          :options="parentList"
          :props="parentListProps"
          @change="handleChange"
          clearable
        ></el-cascader>
      </div>
      <!-- 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isButtonDisabled"
            >添加参数</el-button
          >
          <el-table :data="manyList" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isButtonDisabled"
            >添加属性</el-button>
            <el-table :data="onlyList" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      parentList: [],
      selectedKeys: [],
      parentListProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      // 动态参数列表
      manyList: [],
      // 静态参数列表
      onlyList: []
    }
  },
  created () {
    this.getParentList()
  },
  methods: {
    async getParentList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.mag)
      }
      // console.log(res)
      this.parentList = res.data
    },
    // 级联选择器改变事件
    handleChange () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyList = []
        this.oneList = []
        return false
      }
      this.getParamsList()
    },
    // 页签点击改变
    handleTabClick () {
      this.getParamsList()
    },
    // 获取参数列表
    async getParamsList () {
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        // console.log(res.data)
        if (this.activeName === 'many') {
          this.manyList = res.data
        } else {
          this.onlyList = res.data
        }
      }
    }
  },
  computed: {
    isButtonDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    catId () {
      if (this.selectedKeys.length !== 3) {
        return null
      } else {
        return this.selectedKeys[2]
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
