<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchGoodsValue"
            @clear="inputCleared"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
            <template v-slot:default="slotProps">{{slotProps.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
            <template v-slot:default="slotProps">
            <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="deleteGoods(slotProps.row)"
            ></el-button
          >
            </template>
        </el-table-column>
      </el-table>
      <!-- 页签 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goodsTotal">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchGoodsValue: '',
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表总数
      goodsTotal: 0,
      //   商品列表数据
      goodsList: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      //   console.log(res.data)
      this.goodsTotal = res.data.total
      this.goodsList = res.data.goods
    },
    // 当前页面显示条数改变
    handleSizeChange (size) {
    //   console.log(size)
      this.queryParams.pagesize = size
      this.getGoodsList()
    },
    // 当前页面发生改变
    handleCurrentChange (currentPage) {
    //   console.log(current)
      this.queryParams.pagenum = currentPage
      this.getGoodsList()
    },
    // 搜索商品
    searchGoods () {
      this.queryParams.query = this.searchGoodsValue
      this.getGoodsList()
    },
    // 清空搜索商品输入框
    inputCleared () {
      this.queryParams.query = ''
      this.getGoodsList()
    },
    // 删除商品
    deleteGoods (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.getGoodsList()
        this.$message.success('删除成功')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
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
</style>
