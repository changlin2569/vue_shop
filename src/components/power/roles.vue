<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-button type="primary">添加角色</el-button>
        <!-- 角色列表 -->
      <el-table :data="roleList" border style="width: 100%;margin-top: 20px;" stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
              <template v-slot:default="roleProps">
                <el-row v-for="(item1,i1) in roleProps.row.children" :key="item1.id"  :class="['tagBottom',i1 === 0 ? 'tagTop' : '']">
                    <!-- 第一层权限 -->
                    <el-col :span="6">
                        <el-tag>{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 第二层权限 -->
                    <el-col :span="18">
                        <el-row  :class="i2 === 0 ? '' : 'tagTop'" v-for="(item2,i2) in item1.children" :key="item2.id">
                            <el-col :span="8">
                                <el-tag type="success">{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="16">
                                <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
              </template>
          </el-table-column>
          <!-- 角色信息列 -->
          <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting"  size="mini">分配权限</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: []
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
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 10px;
}

.tagBottom {
    border-bottom: 1px solid #eee;
}

.tagTop {
    border-top: 1px solid #eee;
}
</style>
