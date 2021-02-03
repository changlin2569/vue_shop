<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <div>
          <el-table :data="rightsList" border style="width: 100%" stripe>
              <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="authName" label="权限名称" >
            </el-table-column>
            <el-table-column prop="path" label="路径" >
            </el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template v-slot:default="slotProps">
                <el-tag v-if="slotProps.row.level === '0'">一级</el-tag>
                <el-tag v-else-if="slotProps.row.level === '1'" type="success">二级</el-tag>
                <el-tag v-else-if="slotProps.row.level === '2'" type="warning">三级</el-tag>
                </template>
            </el-table-column>
          </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    //  获取权限列表
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status === 200) {
        this.rightsList = res.data
        this.$message.success(res.meta.msg)
      } else {
        return this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
