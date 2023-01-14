<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 警告提示区 -->
      <el-alert
        title="添加商品信息"
        type="warning"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
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

      <!-- Tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的地址，要写完整的地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片上传预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "AddGoods",
  data() {
    return {
      activeIndex: "0",
      //   添加商品表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 商品图片数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        // 商品属性数组
        attrs: [],
      },
      //   添加商品表单数据验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //   商品分类列表数据
      cateList: [],
      //   商品分类配置项参数；label-展示的属性：value-选中的属性：children-决定父子级的属性
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //   商品动态参数列表数据
      manyTableData: [],
      // 商品静态属性列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片上传组件的图片预览路径
      previewPath: "",
      // 图片预览对话框是否展示
      previewDialogVisible: false,
    };
  },
  created() {
    // 获取商品分类列表数据
    this.getCateList();
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      this.cateList = res.data;
    },

    // 级联选择器选中项变化，触发函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        this.$message.info("商品分类必须选择三级分类");
      }
    },

    // 监听tab页切换事件，切换前执行
    beforeTabLeave(activeName, oldActiveName) {
      // 之前激活的页面是第一页，且没有选择商品分类，则不允许tab切换
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
      return true;
    },

    // tab页切换时触发
    async tabClicked() {
      // activeIndex---当前激活的面板名字
      if (this.activeIndex === "1") {
        // 发起商品参数数据请求
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品参数列表失败");
        }

        // 将data里的attr_vals属性转换成数组形式
        res.data.forEach((item) => {
          // 若属性为空，则返回空数组，反之以空格分隔，转换为数组
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });

        // 将得到是数据保存到 manyTableData
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        // 当前激活页面为商品属性，发起请求，获取静态属性数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品属性列表失败");
        }

        this.onlyTableData = res.data;
      }
    },

    // 处理图片预览事件
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },

    // 处理图片移除操作
    handleRemove(file) {
      // 1. 获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path;
      // 2. 从Pics数组中，找到这个图片对应的索引值
      // findIndex(回调函数)，返回匹配的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 3. 调用数组的splice方法，把图片信息对象从Pics数组中移除
      this.addForm.pics.splice(i, 1);
    },

    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2. 将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo);
    },

    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 执行添加商品业务逻辑
        // 1. 处理goods_cat，将其转换成，分隔的字符串
        // 先进行深拷贝，然后再操作
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");

        // 2. 利用静态属性数据和动态参数数据，生成attrs列表
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        // 将处理好的属性赋值到form中
        form.attrs = this.addForm.attrs;

        // 发起请求，添加商品
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201) {
          return this.$message.error("创建商品失败");
        }
        this.$message.success("创建商品成功");
        // 跳转到商品列表页面
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>