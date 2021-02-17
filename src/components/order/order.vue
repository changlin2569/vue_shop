<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="orderQueryInfo.query"
            @clear="inputCleared"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchOrders"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 数据列表 -->
      <el-table :data="orderList" stripe style="width: 100%" border="">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="500">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否付款">
          <template v-slot:default="slotProps">
            <el-tag type="danger" v-if="slotProps.row.pay_status"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间" width="200">
          <template v-slot:default="slotProps">
            {{ slotProps.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editDialog"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            @click="showDialog"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderQueryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="orderQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderTotal"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form
        :model="editAddressForm"
        :rules="editAddressFormRule"
        ref="editAddressFormRef"
        label-width="100px"
      >
        <el-form-item label="省/市/区" prop="address1">
          <el-cascader
            v-model="editAddressForm.address1"
            :options="addressData"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看信息对话框 -->
    <el-dialog
  title="物流信息"
  :visible.sync="showDialogVisible"
  width="50%">
   <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in locationList"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="showDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import addressData from './citydata.js'
export default {
  data () {
    return {
      orderQueryInfo: {
        pagenum: 1,
        pagesize: 10,
        query: ''
      },
      orderTotal: 0,
      orderList: [],
      //   控制修改地址对话框
      editDialogVisible: false,
      editAddressForm: {
        address1: [],
        address2: ''
      },
      editAddressFormRule: {
        address1: [
          { required: true, message: '请选择省市区', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      //   省市区数据
      addressData: addressData,
      //   查看物流信息对话框
      showDialogVisible: false,
      locationList: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    //   输入框清楚事件
    inputCleared () {
      this.getOrderList()
    },
    // 请求数据列表
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.orderQueryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //   console.log(res)
      this.orderTotal = res.data.total
      this.orderList = res.data.goods
    },
    // 搜索订单事件
    searchOrders () {
      this.getOrderList()
    },
    // 页面显示条数改变
    handleSizeChange (size) {
      this.orderQueryInfo.pagesize = size
      this.getOrderList()
    },
    // 当前页面改变
    handleCurrentChange (currentSize) {
      this.orderQueryInfo.pagenum = currentSize
      this.getOrderList()
    },
    editDialog () {
      this.editDialogVisible = true
    },
    // 修改地址对话框关闭
    editDialogClose () {
      this.$refs.editAddressFormRef.resetFields()
    },
    // 请求物流信息
    async getLocationInfo () {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //   console.log(res.data)
      this.locationList = res.data
    },
    showDialog () {
      this.getLocationInfo()
      this.showDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
