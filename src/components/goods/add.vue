<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="+activePath"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addcateFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activePath"
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addCateForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addCateForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addCateForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addCateForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addCateForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="chitem"  v-for="(chitem, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activePath: '0',
      addCateForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: []
      },
      addCateFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //   商品数据列表
      cateList: [],
      // 级联选择器配置
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   商品参数数据
      manyTableData: []
    }
  },
  created () {
    this.getCatelist()
  },
  methods: {
    async getCatelist () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
    },
    // 级联选择器选项改变
    handleChange () {
      //   console.log(this.addCateForm.goods_cat)
      if (this.addCateForm.goods_cat.length !== 3) {
        this.addCateForm.goods_cat = []
      }
    },
    // 切换标签之前的钩子函数
    beforeLeave (activeName, oldActiveName) {
      //   console.log(activeName, oldActiveName)
      if (oldActiveName === '0' && this.addCateForm.goods_cat.length === 3) {
        return true
      }
      this.$message.error('请选择商品分类')
      return false
    },
    // 标签页被点击事件
    async tabClicked () {
      //   console.log(this.activePath)
      if (this.activePath === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }
    }
  },
  computed: {
    cateId () {
      if (this.addCateForm.goods_cat.length === 3) {
        return this.addCateForm.goods_cat[2]
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
    margin:0 10px 0 0!important;
}
</style>
