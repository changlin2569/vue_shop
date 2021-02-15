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
        ref="addCateFormRef"
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
                <el-checkbox
                  :label="chitem"
                  v-for="(chitem, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3"
            ><el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="uploadHead"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addCateForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addFormHandle"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片 -->
    <el-dialog title="提示" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewImgPath" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activePath: '0',
      addCateForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
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
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 上传的文件列表
      // fileList: [],
      uploadHead: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片对话框
      previewDialogVisible: false,
      // 预览图片的路径
      previewImgPath: ''
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
      if (this.addCateForm.goods_cat.length === 3) {
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
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activePath === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        // console.log(res)
        this.onlyTableData = res.data
      }
    },
    // 点击预览图片的事件
    handlePreview (file) {
      // console.log(file)
      this.previewImgPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 移除上传图片的事件
    handleRemove (file) {
      const index = this.addCateForm.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      // console.log(index)
      this.addCateForm.pics.splice(index, 1)
      // console.log(this.addCateForm)
    },
    // 文件上传成功
    handleSuccess (res) {
      // console.log(this.fileList)
      // console.log(res)
      const picInfo = {
        pic: res.data.tmp_path
      }
      this.addCateForm.pics.push(picInfo)
      // console.log(this.addCateForm)
    },
    // 点击添加商品
    addFormHandle () {
      const newForm = _.cloneDeep(this.addCateForm)
      newForm.goods_cat = newForm.goods_cat.join(',')
      // console.log(newForm)
      // 添加动态参数
      this.manyTableData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addCateForm.attrs.push(newInfo)
      })
      // 添加静态属性
      this.onlyTableData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addCateForm.attrs.push(newInfo)
      })
      newForm.attrs = this.addCateForm.attrs
      // console.log(newForm)
      this.$refs.addCateFormRef.validate(async (addFlag) => {
        if (!addFlag) {
          return this.$message.error('请填写必要的表单项')
        }
        const { data: res } = await this.$http.post('goods', newForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
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
  margin: 0 10px 0 0 !important;
}

.el-button {
  margin-top: 20px;
}
</style>
