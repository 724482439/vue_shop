<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主体区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoledialogVisible = true"
            >添加角色</el-button
          >
          <!-- 添加角色对话框 -->
          <el-dialog
            title="添加角色信息"
            :visible.sync="addRoledialogVisible"
            width="50%"
            @close="addRoleDialogClosed"
          >
            <!-- 添加角色表单 -->
            <el-form
              :model="addRoleForm"
              :rules="addRoleFormRules"
              ref="addRoleFormRef"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRoleForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRoleForm.roleDesc"></el-input>
              </el-form-item>
            </el-form>

            <!-- 添加角色对话框底部按钮 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addRoledialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格布局 将一行划分为24格，通过:span 来控制列宽-->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环，嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限渲染 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限渲染 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleById(scope.row.id)"
              >编辑</el-button
            >
            <!-- 编辑角色信息对话框 -->
            <el-dialog
              title="编辑角色信息"
              :visible.sync="editRoledialogVisible"
              width="50%"
              @close="editRoleDialogClosed"
            >
              <!-- 添加角色表单 -->
              <el-form
                :model="editRoleForm"
                :rules="addRoleFormRules"
                ref="editRoleFormRef"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
              </el-form>

              <!-- 编辑角色对话框底部按钮 -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="editRoledialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="editRole">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色 -->
            <!-- tooltip按钮上方提示文字 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
            <!-- 分配权限对话框 -->
            <el-dialog
              title="分配角色"
              :visible.sync="SetRightDialogVisible"
              width="50%"
              @close="SetRightDialogClosed"
            >
              <!-- 树形控件 data绑定数据源，props指定绑定对象，用哪个属性实现父子关系，和展示哪个字段-->
              <el-tree
                :data="rightsList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defKeys"
                ref="treeRef"
              ></el-tree>
              <!-- 分配权限对话框底部按钮 -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="SetRightDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="allotRights()"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "UserRoles",
  data() {
    return {
      // 角色列表
      rolesList: [],
      //   添加角色对话框是否隐藏
      addRoledialogVisible: false,
      //   添加角色表单
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      //   添加角色表单和编辑角色验证规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      //   编辑角色对话框是否隐藏
      editRoledialogVisible: false,
      //   编辑角色列表数据
      editRoleForm: {},
      // 分配权限对话框是否展示
      SetRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 分配权限树形控件属性绑定对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 树形控件中默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的角色ID
      roleId: "",
    };
  },
  created() {
    // 获取角色列表
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
    },
    // 监听添加角色对话框关闭事件
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 点击添加角色确定按钮，添加角色
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        // 表单验证通过，发起添加角色请求
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) {
          return this.$message.error("创建角色失败");
        }
        this.addRoledialogVisible = false;
        this.getRolesList();
        this.$message.success("创建角色成功");
      });
    },
    // 监听编辑角色对话框关闭事件
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 通过ID编辑角色信息
    async editRoleById(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败");
      }
      this.editRoleForm = res.data;
      this.editRoledialogVisible = true;
    },
    // 编辑并提交角色信息
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoleForm.roleId,
          this.editRoleForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("编辑角色信息失败");
        }
        this.$message.success("修改角色信息成功");
        this.editRoledialogVisible = false;
        this.getRolesList();
      });
    },
    // 删除角色信息
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      //   用户确认删除，发出删除请求
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色信息失败");
      }
      this.$message.success("删除角色信息成功！");
      this.getRolesList();
    },
    // 通过ID删除对应的三级权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 判断用户是否确认删除
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      // 用户确认删除，发起删除请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("取消权限成功！");
      // 下面这样，会导致展开框关上，不建议这么做
      // this.getRolesList();
      role.children = res.data;
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("请求权限数据失败");
      }
      // 获取到的权限数据保存到data中
      this.rightsList = res.data;

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
      // 展示分配权限对话框
      this.SetRightDialogVisible = true;
    },
    // 通过递归形式获取每个角色下所有三级权限的id，并保存到defKeys中
    getLeafKeys(node, arr) {
      // 如果当前node节点，不包含children属性，则是三级节点，将其id加到数组中
      if (!node.children) {
        return arr.push(node.id);
      }
      // 当前node节点不是三级节点，则遍历children属性
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听分配权限对话框的关闭事件
    SetRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击分配权限对话框的确定按钮，为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      // 刷新角色列表
      this.getRolesList();
      this.SetRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

// 纵向居中对齐
.vcenter {
  display: flex;
  align-items: center;
}
</style>