<template>
  <div class="type-list">
    <div class="seach-section">
      <div class="create-type">
        <el-button type="primary" @click="articleType">添加文章分类</el-button>
        <el-button type="danger" :disabled="!isSelect" @click="removeMoreType">删除选择</el-button>
      </div>
      <el-form :inline="true" :model="seachCondition" class="demo-form-inline">
        <el-form-item label="类型名称">
          <el-input v-model="seachCondition.title" placeholder="输入类型名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="seachCondition.status" placeholder="输入状态">
            <el-option label="选择状态" value="-1" />
            <el-option label="正常" value="0" />
            <el-option label="冻结" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initTypeList">查询</el-button>
        </el-form-item>
      </el-form>
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
              :src="
                scope.row.img == ''
                  ? '/src/assets/images/nopic.png'
                  : serverUrl + '/' + scope.row.img
              "
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
      <div class="pagination-box" >
        <el-pagination
          background
          :pager-count="paginationOptions.pagerCount"
          :page-size="paginationOptions.pageSize"
          :page-sizes="paginationOptions.pageArray"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationOptions.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
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


//搜索查询条件
const seachCondition = reactive({
  title: "",
  status: "-1",
});
const copySearchCondition = ref({});

//分页
const paginationOptions = reactive({
  //总数量
  total: 0,

  //页码数量
  pagerCount: 5,

  //每页展示的数量
  pageSize: 10,

  // 页面选择
  pageArray: [2, 5, 10, 20, 30, 50, 100, 200],

  //数据偏移量
  offset: 0,
});
const typeIds = ref([] as any[]);


// 类型列表数据
const tableData = ref([]);

// 页面加载执行
onMounted(() => {
  initTypeList();
  
});

const isSelect = computed(()=>{
  return typeIds.value.length > 0
  
})


const initTypeList=()=> {
      paginationOptions.total = 0;
      paginationOptions.offset = 0;
      copySearchCondition.value = seachCondition
      getTypeCount();
      search();
    };


//搜索查询
const search = () => {
  //获取查询条件
  let params = {
     //数据偏移量
     offset: paginationOptions.offset,
      count:paginationOptions.pageSize
  };
  
  for (let key in copySearchCondition.value) {
    if (
      (key == "status" && copySearchCondition.value[key] == "-1") ||
      !copySearchCondition.value[key]
    ) {
      continue;
    }
    params[key] = copySearchCondition.value[key];
  }

  proxy.$axios
    .get("/typeList", {
      params,
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }
      if (result.data.status == 1060) {
        // 处理时间
        result.data.data.forEach((v) => {
          v.createdAt = tool.formatDate(v.createdAt, "yyyy-MM-dd hh:mm:ss");
          v.updatedAt = tool.formatDate(v.updatedAt, "yyyy-MM-dd hh:mm:ss");
        });
        tableData.value = result.data.data;
        getTypeCount();
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
      url: "/typeStatus",
      data: {
        typeId: item.typeId,
        status: item.status == 0 ? 1 : 0,
        type: "ArticleType",
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

      if (result.data.status == 1070) {
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
  router.push({ name: "ArticleType", query: { typeId } });
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
        type: "ArticleType",
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
          initTypeList();
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

//查询分类总数量
const getTypeCount = () => {
  //获取查询条件
  let params = {};
  for (let key in copySearchCondition.value) {
    if (
      (key == "status" && copySearchCondition.value[key] == "-1") ||
      !copySearchCondition.value[key]
    ) {
      continue;
    }
    params[key] = copySearchCondition.value[key];
  }
  proxy.$axios
    .get("/typeCount", {
      params,
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }
      if (result.data.status == 1110) {
        paginationOptions.total = result.data.data[0].count;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

//切换页码
const handleSizeChange = (val: number) => {
  paginationOptions.offset =0;
  paginationOptions.pageSize=val;
  search();
};
const handleCurrentChange = (val: number) => {
  paginationOptions.offset = (val - 1) * paginationOptions.pageSize;
  search();
};


// 添加分类文章
const articleType = () => {
  router.push({ name: "ArticleType" });
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