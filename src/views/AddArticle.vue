<template>
  <div class="create-type-section">
    <back title="添加文章"></back>
    <div class="create-type-form">
      <el-form
        ref="typeDataRef"
        :model="typeData"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="文章类型" prop="typeId">
          <el-select v-model="typeData.typeId" clearable placeholder="选择分类">
            <el-option
              :label="item.title"
              :value="item.typeId"
              v-for="item in typeList"
              :key="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章名称" prop="title">
          <el-input v-model="typeData.title" placeholder="输入文章名称" />
        </el-form-item>
        <el-form-item label="图片" class="imgBox">
          <el-upload
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            v-model:file-list="typeData.fileList"
            accept=".png,.jpg,.jpeg,.webp"
            :on-preview="handlePictureCardPreview"
          >
            <el-icon color="#999999">
              <Plus />
            </el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="图片预览" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="typeData.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>

        <el-form-item label="内容">
          <div class="editor">
            <TEditor ref="editor" v-model="typeData.content"  @getContent="getContent"/>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="typeData.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(typeDataRef)">{{
            artId ? "保存" : "创建文章"
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import { reactive, ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadUserFile,
  UploadProps,
} from "element-plus";
import { ElMessage } from "element-plus";
import Back from "../components/Back.vue";
import TEditor from "../components/TEditor.vue";
import { log } from "console";

const { proxy } = getCurrentInstance() as any;
const router = useRouter();

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 服务器地址
const serverUrl = proxy.$serverUrl;

// do not use same name with ref
const formSize = ref("default");
const typeDataRef = ref<FormInstance>();
const value = ref("");
const typeList = ref([] as any[]);

const typeData = reactive({
  name: "Article", // 表名
  typeId: "",
  title: "",
  fileList: [] as any,
  description: "",
  content: "",
  status: "0",
});
//复制typeData数据, 便于在保存类型数据时, 对比typeData数据的变化
const copyTypeData = ref({});
const imgArray = ref([]);
const artId = ref();

const getContent = (v: string) => {
  typeData.content = v
}
// 页面加载执行
onMounted(() => {
  let artId1 = router.currentRoute.value.query.artId;
  if (artId1) {
    artId.value = artId1;
    getArticleDataByArtId();
  }
  getTypeData();
});

const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入文章名称", trigger: "blur" }],
  typeId: [{ required: true, message: "请选择分类", trigger: "change" }],
});

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

// 处理表单数据
const processoFrmData = (data) => {
  const formData = new FormData();
  for (let key in data) {
    if (key == "fileList") {
      data.fileList.forEach((item) => {
        formData.append("file", item.raw);
      });
      if (data.fileList.length === 0) {
        formData.append("file", "");
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
};
let config = {
  headers: {
    token: document.cookie,
    "Content-Type": "multipart/form-data",
  },
};


const getTypeData = () => {
  proxy
    .$axios({
      method: "get",
      url: "/typeData",
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
        return router.push({ name: "Login" });
      } else if (result.data.status == 1140) {
        // ElMessage({
        //   showClose: true,
        //   message: result.data.msg,
        //   type: "success",
        // });
        typeList.value = result.data.data;
      } else {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const getArticleDataByArtId = () => {
  proxy.$axios
    .get("/articleDataByArtId", {
      params: {
        artId: artId.value,
      },
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
        return router.push({ name: "Login" });
      } else if (result.data.status == 1190) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "success",
        });

        let data = result.data.data[0];
        typeData.title = data.title;
        // typeData.fileList = [];
        if (data.imgMore != "") {
          let imgMore = data.imgMore.split(",");
          for (let index = 0; index < imgMore.length; index++) {
            typeData.fileList.push({ url: serverUrl + "/" + imgMore[index] });
          }
        }

        typeData.description = data.description;
        typeData.content = data.content;
        typeData.status = Number(data.status).toString();
        typeData.typeId = data.typeId;
        //复制typeData
        copyTypeData.value = JSON.parse(JSON.stringify(typeData));
      } else {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
// 创建文章
const createArticle = (formData, config) => {
  proxy.$axios
    .post("/createArticle", formData, config)
    .then((result) => {
      if (result.data.status == 1041) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
        return router.push({ name: "Login" });
      } else if (result.data.status == 1130) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "success",
        });
        return router.push({ name: "ArticleList" });
      } else {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// 编辑分类
let values = {};
const editArticle = (config) => {
  // 对比copyTypeData 和 typeData数据
  for (let key in typeData) {
    if (key === "fileList") {
      if (typeData[key].length == copyTypeData.value[key].length) {
        for (let i = 0; i < typeData[key].length; i++) {
          if (copyTypeData.value[key][i].url != typeData[key][i].url) {
            values[key] = typeData[key];
          }
        }
      } else {
        values[key] = typeData[key];
      }
    } else {
      if (copyTypeData.value[key] != typeData[key]) {
        values[key] = typeData[key];
      }
    }
  }

  if (JSON.stringify(values) == "{}") {
    return router.push({ name: "ArticleList" });
  }
  values["artId"] = artId.value;
  values["type"] = "Article";
  let editData = processoFrmData(values);
  proxy.$axios
    .post("/editArticle", editData, config)
    .then((result) => {
      if (result.data.status == 1041) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
        return router.push({ name: "Login" });
      } else if (result.data.status == 1200) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "success",
        });
        return router.push({ name: "ArticleList" });
      } else {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  let createData = processoFrmData(typeData);
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (artId.value) {
        //编辑文章
        editArticle(config);
      } else {
        //创建文章
        createArticle(createData, config);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
  
  <style type="text/css" lang="less">
@m1: #409eff;
.create-type-section {
  height: 100%;

  .create-type-form {
    padding: 15px;
    background: #fff;
    border-radius: 5px;
    margin-top: 15px;
    height: calc(100% - 93px);
    overflow-y: auto;
  }

  .el-upload--picture-card {
    width: 76px;
    height: 76px;
    background-color: transparent;
  }

  .el-upload-list__item {
    width: 76px !important;
    height: 76px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f8f8;

    img {
      max-width: 100%;
      max-height: 100%;
      display: block;
    }
  }

  .text-center {
    text-align: center;
  }
}

.el-overlay {
  .el-overlay-dialog {
    .el-dialog__body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50vh;

      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
.editor {
  width: 860px;
  .ql-container {
    height: 340px;
  }
}
</style>