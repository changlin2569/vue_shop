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
          <el-button
            type="primary"
            :disabled="isButtonDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyList" border>
            <el-table-column type="expand">
              <template v-slot:default="slotProps">
                <el-tag
                  v-for="(item, index) in slotProps.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTag(index,slotProps.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="slotProps.row.inputVisible"
                  v-model="slotProps.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slotProps.row)"
                  @blur="handleInputConfirm(slotProps.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(slotProps.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="slotProps">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(slotProps.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(slotProps.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isButtonDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyList" border>
            <el-table-column type="expand">
              <template v-slot:default="slotProps">
                <el-tag
                  v-for="(item, index) in slotProps.row.attr_vals"
                  :key="index"
                  closable
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="slotProps.row.inputVisible"
                  v-model="slotProps.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(slotProps.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="slotProps">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(slotProps.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(slotProps.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsHandle">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsHandle">确 定</el-button>
      </span>
    </el-dialog>
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
      onlyList: [],
      // 控制添加分类对话框
      addDialogVisible: false,
      // 添加参数表单
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数验证规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制编辑对话框
      editDialogVisible: false,
      editParamsForm: {
        attr_name: ''
      },
      // 编辑分类验证规则
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 当前属性id
      attrId: ''
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
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyList = res.data
        } else {
          this.onlyList = res.data
        }
      }
    },
    // 添加参数对话框关闭
    addDialogClose () {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 提交添加动态参数
    addParamsHandle () {
      this.$refs.addParamsFormRef.validate(async (addFlag) => {
        if (!addFlag) return false
        const { data: res } = await this.$http.post(
          `categories/${this.catId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.getParamsList()
        this.addDialogVisible = false
      })
    },
    // 编辑分类按钮点击
    async editParams (attrId) {
      // console.log(attrId)
      // this.editParamsForm = this.getParamsById(attrId)
      // console.log(await this.getParamsById(attrId))
      this.attrId = attrId
      this.editParamsForm = await this.getParamsById(attrId)
      this.editDialogVisible = true
    },
    // 编辑分类对话框关闭
    editDialogClose () {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 编辑分类提交
    async editParamsHandle () {
      const { data: res } = await this.$http.put(
        `categories/${this.catId}/attributes/${this.attrId}`,
        {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('编辑成功')
      this.attrId = ''
      this.editDialogVisible = false
      this.getParamsList()
    },
    // 根据id查询参数
    async getParamsById (id) {
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // console.log(res.data)
      return res.data
    },
    // 删除按钮点击
    deleteParams (attrId) {
      this.$confirm('此操作将永久删除参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // console.log(11)
          const { data: res } = await this.$http.delete(
            `categories/${this.catId}/attributes/${attrId}`
          )
          if (res.data.status !== 200) {
            return this.$message.error(res.data.msg)
          }
          this.getParamsList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // tag 输入框失去焦点
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      this.saveAttributes(row)
      // this.getParamsList()
      row.inputVisible = false
    },
    // 展示添加tag
    showInput (row) {
      row.inputVisible = true
      // $nextTick方法，当页面上的元素被重新渲染后，执行其中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag
    deleteTag (index, row) {
      // const index = row.attr_vals.indexOf(item)
      // console.log(index)
      row.attr_vals.splice(index, 1)
      this.saveAttributes(row)
    },
    // 将修改的属性保存在数据库中
    async saveAttributes (row) {
      const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      return this.$message.success(res.meta.msg)
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
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 120px;
}
</style>
