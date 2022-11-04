<template>
  <div class="type-list">
    <div class="seach-section">
      <div class="create-type">
        <el-button type="primary" @click="addType">添加轮播图分类</el-button>
        <el-button type="danger" :disabled="!isSelect" @click="removeMoreType">删除选择</el-button>
      </div>
    </div>
    <div class="type-list-table">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="title" label="名称" width="120" />
        <el-table-column
          property="status"
          label="状态"
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">{{
            scope.row.status == 0 ? "正常" : "冻结"
          }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="scope">{{ scope.row.createdAt }}</template>
        </el-table-column>
        <el-table-column label="图片" width="180">
          <template #default="scope"
            ><img
              src="/src/assets/images/nopic.png"
          /></template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="default"
              plain
              @click="handleEdit(scope.row.typeId)"
              >编辑
            </el-button>
            <el-button
              size="small"
              type="success"
              plain
              v-if="scope.row.status == 1"
              @click="toggleTypeStatus(scope.row)"
              >启用
            </el-button>
            <el-button
              size="small"
              type="warning"
              plain
              v-else
              @click="toggleTypeStatus(scope.row)"
              >冻结
            </el-button>
            <el-button
              size="small"
              type="danger"
              plain
              @click="removeOneType(scope.row.typeId)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { reactive, ref, onMounted, getCurrentInstance ,computed} from "vue";
import { ElTable } from "element-plus";
import { ElMessage } from "element-plus";
import { tool } from "../assets/js/tool";
// 路由
const router = useRouter();
const { proxy } = getCurrentInstance() as any;
interface User {
  typeId(typeId: any);
  title: string;
  status: string;
}
// 服务器地址
const serverUrl = proxy.$serverUrl;


const typeIds = ref([] as any[]);


// 类型列表数据
const tableData = ref([]);

// 页面加载执行
onMounted(() => {
  getBannerType();
  
});

const isSelect = computed(()=>{
  return typeIds.value.length > 0
  
})



//获取分类
const getBannerType = () => {
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
        result.data.data.forEach((v) => {
          v.createdAt = tool.formatDate(v.createdAt, "yyyy-MM-dd hh:mm:ss");
          v.updatedAt = tool.formatDate(v.updatedAt, "yyyy-MM-dd hh:mm:ss");
        });
        tableData.value = result.data.data;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};


// 切换文章类型状态
const toggleTypeStatus = (item) => {
  proxy
    .$axios({
      method: "post",
      url: "/banTypeStatus",
      data: {
        typeId: item.typeId,
        status: item.status == 0 ? 1 : 0,
      },
      //请求头
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }

      if (result.data.status == 1240) {
        if (result.data.data.result[0] == 1) {
          ElMessage({
            message: result.data.msg,
            showClose: true,
            type: "success",
          });

          item.status = result.data.data.status;
        } else {
          ElMessage({
            message: result.data.msg,
            type: "error",
            showClose: true,
          });
        }
      } else {
        ElMessage({
          message: result.data.msg,
          type: "error",
          showClose: true,
        });
      }
    })
    .catch((err) => {
      console.log("err ==> ", err);
    });
};

// 编辑类型数据
const handleEdit = (typeId) => {
  router.push({ name: "BannerType", query: { typeId } });
};
  //选择数据行
  const handleSelectionChange = (val: User[]) => {
    typeIds.value=[]
  val.forEach((v) => {
    typeIds.value.push(v.typeId);
  });
};

// 删除商品类型状态
const removeType = (typeIds) => {
  proxy
    .$axios({
      method: "post",
      url: "/removeType",
      data: {
        typeIds,
        type: "BannerType",
      },
      //请求头
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }

      if (result.data.status == 1100) {
        ElMessage({
            message: result.data.msg,
            showClose: true,
            type: "success",
          });
          tableData.value=[];
          getBannerType();
      } else {
        ElMessage({
          message: result.data.msg,
          type: "error",
          showClose: true,
        });
      }
    })
    .catch((err) => {
      console.log("err ==> ", err);
    });
};

 //单个删除
 const removeOneType=(typeId)=> {
      removeType([typeId]);
  };

    //多个删除
 const removeMoreType=()=>{
      removeType(typeIds.value);
  }




// 添加分类
const addType = () => {
  router.push({ name: "BannerType" });
};
</script>

<style type="text/css" lang="less">
@m1: #409eff;

.type-list {
  .seach-section {
    background: #fff;
    padding: 15px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;

    .el-form-item {
      margin-bottom: 0;
      margin-right: 15px;
      width: 210px;

      &:last-of-type {
        margin-right: 0;
        width: auto;
      }
    }
  }

  .type-list-table {
    background: #fff;
    padding: 15px;
    border-radius: 5px;
    margin-top: 15px;
    .cell {
      height: 50px;
      display: flex;
      align-items: center;
      img {
        height: 40px;
        width: auto;
      }
    }
    .pagination-box {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>