<template>
  <div class="article-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never" border="false">
      <template #header>
        <div class="header">
          <span>共 {{ total }} 条记录</span>
          <el-button
            @click="openDrawer('add')"
            icon="el-icon-plus"
            size="small"
            type="primary"
            round
          >
            添加面经
          </el-button>
        </div>
      </template>

      <el-table :data="list" style="width: 100%">
        <el-table-column prop="stem" label="标题" width="400">
        </el-table-column>
        <el-table-column prop="creator" label="作者"> </el-table-column>
        <el-table-column prop="likeCount" label="点赞"> </el-table-column>
        <el-table-column prop="views" label="浏览数"> </el-table-column>
        <el-table-column prop="createdAt" label="更新时间" width="200">
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ row }">
            <div class="actions">
              <i
                @click="openDrawer('preview', row.id)"
                class="el-icon-view"
              ></i>
              <i
                @click="openDrawer('edit', row.id)"
                class="el-icon-edit-outline"
              ></i>
              <el-popconfirm title="您确定要删除吗？" @confirm="del(row.id)">
                <i slot="reference" class="el-icon-delete"></i>
              </el-popconfirm>
              <!-- <i class="el-icon-delete" @click="del(row.id)"></i> -->
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 抽屉组件 -->
    <el-drawer
      :visible.sync="isShowDrawer"
      :before-close="handleClose"
      :title="title[type]"
      direction="rtl"
      size="50%"
    >
      <div v-if="type === 'preview'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>
      <el-form
        v-else
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="标题" prop="stem">
          <el-input v-model="form.stem" placeholder="输入面经标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor
            @blur="$refs.form.validateField('content')"
            v-model="form.content"
          ></quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确认</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  createArticle,
  getArticleList,
  removeArticle,
  getArticleDetail,
  updateArticle,
} from "@/api/article";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "article-page",
  components: {
    quillEditor,
  },
  data() {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      list: [],
      isShowDrawer: false,
      type: "add",
      title: {
        add: "添加面经",
        edit: "修改面经",
        preview: "预览面经",
      },
      form: {
        stem: "",
        content: "",
      },
      rules: {
        stem: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.initData();
  },
  // computed: {
  //   drawerTitle() {
  //     let title = "大标题";
  //     if (this.drawerType === "add") title = "添加面经";
  //     if (this.drawerType === "preview") title = "面经预览";
  //     if (this.drawerType === "edit") title = "修改面经";
  //     return title;
  //   },
  // },
  methods: {
    // 初始化表格数据
    async initData() {
      const res = await getArticleList({
        current: this.current,
        pageSize: this.pageSize,
      });
      console.log(res);
      this.list = res.data.rows;
      this.total = res.data.total;
    },
    // 删除
    async del(id) {
      await removeArticle(id);
      this.$message.success("删除成功");
      //  如果当前页只有一条数据，且不是第一页，返回上一页
      if (this.list.length === 1 && this.current > 1) {
        this.current--;
      }
      this.initData();
    },
    // 处理当前页变化
    handleCurrentChange(val) {
      // 处理当前页变化
      this.current = val;
      this.initData();
    },
    // 打开抽屉
    async openDrawer(type, id) {
      // console.log(type, id);
      this.type = type;
      this.isShowDrawer = true;
      //除了添加面经外，其余两种情况都需要获取面经详情
      // 发请求获取面经详情
      if (type !== "add") {
        const res = await getArticleDetail(id);
        this.form = {
          ...res.data,
        };
      }
    },
    // 关闭抽屉
    handleClose() {
      // this.isShowDrawer = false;
      this.$confirm("确认关闭？")
        .then((_) => {
          // done();
          this.closeDrawer();
        })
        .catch((_) => {});
    },
    // 确定按钮 （添加和修改公用）
    async submit() {
      try {
        // 1、表单校验
        await this.$refs.form.validate();
        if (this.type == "add") {
          // 2、发起创建面经请求
          await createArticle(this.form);
          // 3、提示用户信息
          this.$message.success("添加成功");
          // 4、返回第一页
          this.current = 1;
        } else if (this.type == "edit") {
          const { id, stem, content } = this.form;
          // 2、发起修改面经请求
          await updateArticle({
            id,
            stem,
            content,
          });
          // 3、提示用户信息
          this.$message.success("修改成功");
        }

        //5、重新获取列表数据
        this.initData();
        //6、关闭抽屉
        this.closeDrawer();
      } catch (e) {
        console.log(e);
      }
    },
    // 关闭抽屉，重置表单
    closeDrawer() {
      // 注意点: 由于公用的抽屉, 当预览时, 是没有表单的! 不能重置表单
      // 但是form的值还在, 会影响添加 => 需要手动重置一下
      // 关闭时将表单内容重置

      // 无论是哪种情况, 一律将form手动数据清零
      this.form = {
        stem: "",
        content: "",
      };
      if (this.type !== "preview") {
        // 只有 add edit 调用 resetFields 在此处的作用: 重置校验状态
        this.$refs.form.resetFields();
      }
      this.isShowDrawer = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }
  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-around;
    color: #666;
    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-breadcrumb {
  margin-top: 10px;
}
.el-form {
  padding-right: 40px;
}
.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}
.el-rate {
  padding: 10px 0;
}
.article-preview {
  padding: 0 40px 40px 40px;
  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}


</style>
