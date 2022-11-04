<template>
  <div class="create-type-section">
    <Back title="添加轮播图分类"></Back>
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
        <el-form-item label="轮播图类型名称" prop="title">
          <el-input v-model="typeData.title" placeholder="输入类型名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="typeData.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="typeData.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(typeDataRef)">{{
            typeId ? "保存" : "创建分类"
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
} from "element-plus";
import { ElMessage } from "element-plus";
import Back from "../components/Back.vue";

const { proxy } = getCurrentInstance() as any;
const router = useRouter();


// 服务器地址
const serverUrl = proxy.$serverUrl;

// do not use same name with ref
const formSize = ref("default");
const typeDataRef = ref<FormInstance>();

const typeData = reactive({
  title: "",
  description: "",
  status: "0",
});
//复制typeData数据, 便于在保存类型数据时, 对比typeData数据的变化
const copyTypeData = ref({});
const typeId = ref();
// 页面加载执行
onMounted(() => {
  let typeId1 = router.currentRoute.value.query.typeId;
  if (typeId1) {
    typeId.value = typeId1;
    getTypeDataByTypeId();
  }
});

const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
});


// 处理表单数据
const processoFrmData = (data) => {
  const formData = new FormData();
  for (let key in data) {
      formData.append(key, data[key]);
  }
  return formData;
};
let config = {
  headers: {
    token: document.cookie,
    "Content-Type": "multipart/form-data",
  },
};


const getTypeDataByTypeId = () => {
  proxy.$axios
    .get("/getBannerType", {
      params: {
        typeId: typeId.value,
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
      } else if (result.data.status == 1260) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "success",
        });

        let data = result.data.data[0];
        typeData.title = data.title;
        typeData.description = data.description;
        typeData.status = Number(data.status).toString();
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
// 创建分类
const createType = (formData, config) => {
  proxy.$axios
    .post("/createBanType", formData, config)
    .then((result) => {
      if (result.data.status == 1041) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
        return router.push({ name: "Login" });
      } else if (result.data.status == 1220) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "success",
        });
        return router.push({ name: "BannerTypeList" });
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
const editType = ( config) => {
  // 对比copyTypeData 和 typeData数据
  for (let key in typeData) {
      if (copyTypeData.value[key] != typeData[key]) {
        values[key] = typeData[key];
    }
  }
  if (JSON.stringify(values) == "{}") {
    return router.push({ name: "BannerTypeList" });
  }
  values["typeId"] = typeId.value;
  let editData = processoFrmData(values);
  proxy.$axios
    .post("/editBannerType", editData, config)
    .then((result) => {
      if (result.data.status == 1041) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "error",
        });
        return router.push({ name: "Login" });
      } else if (result.data.status == 1250) {
        ElMessage({
          showClose: true,
          message: result.data.msg,
          type: "success",
        });
        return router.push({ name: "BannerTypeList" });
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
      if (typeId.value) {
        //编辑商品类型
        editType( config);
      } else {
        //创建商品类型
        createType(createData, config);
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
</style>