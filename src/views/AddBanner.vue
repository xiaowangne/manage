<template>
    <div class="create-type-section">
      <Back title="添加轮播图"></Back>
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
          <el-form-item label="标题" prop="title">
            <el-input v-model="typeData.title" placeholder="输入标题" />
          </el-form-item>
          <el-form-item label="类型" prop="typeId">
          <el-select v-model="typeData.typeId" clearable placeholder="选择分类" @change="getTypeName">
            <el-option 
              :label="item.title"
              :value="item.typeId"
              v-for="item in typeList"
              :key="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="图片">
            <el-upload
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              v-model:file-list="typeData.fileList"
              accept=".png,.jpg,.jpeg,.webp"
              :on-preview="handlePictureCardPreview"
            >
              <el-icon color="#999999" >
                <Plus />
              </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="图片预览" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="typeData.description" type="textarea" />
          </el-form-item>
         
          <el-form-item label="链接">
            <el-input v-model="typeData.url" placeholder="输入链接地址" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="typeData.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">冻结</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(typeDataRef)">{{
              banId ? "保存" : "创建"
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
  import { forEach } from "lodash";
  
  const { proxy } = getCurrentInstance() as any;
  const router = useRouter();
  
  const dialogImageUrl = ref("");
  const dialogVisible = ref(false);
  
  // 服务器地址
  const serverUrl = proxy.$serverUrl;
  
  // do not use same name with ref
  const formSize = ref("default");
  const typeDataRef = ref<FormInstance>();
  const typeList = ref([] as any[]);
  const typeData = reactive({
    title: "",
    typeId: "",
    typeName:'',
    fileList: [] as any,
    description: "",
    status: "0",
    url: '',
  });
  //复制typeData数据, 便于在保存类型数据时, 对比typeData数据的变化
  const copyTypeData = ref({});
  const imgArray = ref([]);
  const banId = ref();
  // 页面加载执行
  onMounted(() => {
    let banId1 = router.currentRoute.value.query.banId;
    if (banId1) {
      banId.value = banId1;
      getTypeDataByTypeId();
    }
    getTypeData()
  });
  
  const rules = reactive<FormRules>({
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    typeId: [{ required: true, message: "请选择分类", trigger: "change" }],
  });
  
  const getTypeName=(val)=>{
    for(let i=0;i<typeList.value.length;i++){
      if(val==typeList.value[i].typeId){
        typeData.typeName=typeList.value[i].title
        return
      }
    }
  }
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
        if(data.fileList.length===0){
          formData.append("file", '');
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
  

//获取分类
const getTypeData = () => {
  proxy.$axios
    .get("/bannerType", {
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }
      if (result.data.status == 1230) {
        // 处理时间
        typeList.value = result.data.data;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
  
  const getTypeDataByTypeId = () => {
    proxy.$axios
      .get("/bannerDataByBanId", {
        params: {
          banId: banId.value,
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
        } else if (result.data.status == 1310) {
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
          typeData.status = Number(data.status).toString();
          typeData.url = data.url;
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
  // 创建分类
  const createBanner = (formData, config) => {
    proxy.$axios
      .post("/createBanner", formData, config)
      .then((result) => {
        if (result.data.status == 1041) {
          ElMessage({
            showClose: true,
            message: result.data.msg,
            type: "error",
          });
          return router.push({ name: "Login" });
        } else if (result.data.status == 1270) {
          ElMessage({
            showClose: true,
            message: result.data.msg,
            type: "success",
          });
          return router.push({ name: "BannerList" });
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
      return router.push({ name: "BannerList" });
    }
    values["banId"] = banId.value;
    let editData = processoFrmData(values);
    proxy.$axios
      .post("/editBanner", editData, config)
      .then((result) => {
        if (result.data.status == 1041) {
          ElMessage({
            showClose: true,
            message: result.data.msg,
            type: "error",
          });
          return router.push({ name: "Login" });
        } else if (result.data.status == 1320) {
          ElMessage({
            showClose: true,
            message: result.data.msg,
            type: "success",
          });
          return router.push({ name: "BannerList" });
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
        if (banId.value) {
          //编辑商品类型
          editType( config);
        } else {
          //创建banner
          createBanner(createData, config);
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