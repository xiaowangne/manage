<template>
    <div class="type-list">
      <div class="seach-section">
        <div class="create-type">
          <el-button type="primary" @click="addArticle">添加文章</el-button>
          <el-button type="danger" :disabled="!isSelect" @click="removeMoreArticle">删除选择</el-button>
        </div>
        <el-form :inline="true" :model="searchCondition" class="demo-form-inline">
          <el-form-item label="文章名称">
            <el-input v-model="searchCondition.title" placeholder="输入文章名称" />
          </el-form-item>
          <el-form-item label="文章类型">
          <el-select
            v-model="searchCondition.typeId"
            placeholder="选择文章类型"
          >
            <el-option label="选择文章类型" value="-1"></el-option>
            <el-option
              :label="item.title"
              :value="item.typeId"
              v-for="item in typeData"
              :key="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchCondition.status" placeholder="选择状态">
              <el-option label="选择状态" value="-1" />
              <el-option label="正常" value="0" />
              <el-option label="冻结" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
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
          <el-table-column prop="typeName" label="文章类型" width="120"/>
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
                @click="handleEdit( scope.row.artId)"
                >编辑
              </el-button>
              <el-button
                size="small"
                type="success"
                plain
                v-if="scope.row.status == 1"
                @click="toggleArticleStatus(scope.row)"
                >启用
              </el-button>
              <el-button
                size="small"
                type="warning"
                plain
                v-else
                @click="toggleArticleStatus(scope.row)"
                >冻结
              </el-button>
              <el-button
                size="small"
                type="danger"
                plain
                @click="removeOneArticle(scope.row.artId)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
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
[x: string]: any;
    title: string;
    status: string;
  }
  // 服务器地址
  const serverUrl = proxy.$serverUrl;
  
  const multipleSelection = ref<User[]>([]);
  
  //搜索查询条件
  const searchCondition = reactive({
    title: "",
    typeId:'-1',
    status: "-1",
  });
  //复制搜索查询条件
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
  const artIds = ref([] as any[]);

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
  
  // 文章列表数据
  const tableData = ref([]);
  // 类型列表数据
  const typeData= ref([] as any[]);
  // 页面加载执行
  onMounted(() => {
    initTypeList();
    getTypeData();
  });
  
  const isSelect = computed(()=>{
  return artIds.value.length > 0
})
const initTypeList=()=> {
      paginationOptions.total = 0;
      paginationOptions.offset = 0;
      copySearchCondition.value = searchCondition
      getArticleCount();
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
    for (let key in searchCondition) {
      if (
        ((key == "status" || key == "typeId") && searchCondition[key] == "-1") ||
        !searchCondition[key]
      ) {
        continue;
      }
      params[key] = searchCondition[key];
    }
    proxy.$axios
      .get("/articleList", {
        params,
        headers: {
          token: document.cookie,
        },
      })
      .then((result) => {
        if (result.data.status == 1041) {
          return router.push({ name: "Login" });
        }
        if (result.data.status == 1160) {
          // 处理时间
          result.data.data.forEach((v) => {
            v.createdAt = tool.formatDate(v.createdAt, "yyyy-MM-dd hh:mm:ss");
            v.updatedAt = tool.formatDate(v.updatedAt, "yyyy-MM-dd hh:mm:ss");
          });
          tableData.value = result.data.data;
         getArticleCount()
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  
  //查询文章总数量
  const getArticleCount = () => {
  //获取查询条件
  let params = {};
  for (let key in copySearchCondition.value) {
    if (
      ((key == "status" || key == "typeId") && copySearchCondition.value[key] == "-1") ||
      !copySearchCondition.value[key]
    ) {
      continue;
    }
    params[key] = copySearchCondition.value[key];
  }
  proxy.$axios
    .get("/articleCount", {
      params,
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }
      if (result.data.status == 1170) {
        paginationOptions.total = result.data.data[0].count;
      }
      
    })
    .catch((error) => {
      console.log("error", error);
    });
};

  // 获取分类数据
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
        typeData.value = result.data.data;
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

  // 切换文章状态
const toggleArticleStatus = (item) => {
  proxy
    .$axios({
      method: "post",
      url: "/articleStatus",
      data: {
        typeId: item.typeId,
        artId:item.artId,
        status: item.status == 0 ? 1 : 0,
        type: "Article",
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

      if (result.data.status == 1180) {
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
  const handleEdit = (artId) => {
    router.push({name:'AddArticle',query: {artId}})
  };
    //选择数据行
    const handleSelectionChange = (val: User[]) => {
    artIds.value=[]
  val.forEach((v) => {
    artIds.value.push(v.artId);
  });
};

// 删除商品类型状态
const removeArticle = (artIds) => {
  proxy
    .$axios({
      method: "post",
      url: '/removeArticle',
      data: {
        artIds,
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

      if (result.data.status == 1210) {
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
 const removeOneArticle=(typeId)=> {
      removeArticle([typeId]);
  };

    //多个删除
 const removeMoreArticle=()=>{
      removeArticle(artIds.value);
  }
  
  
  // 添加分类文章
  const addArticle = () => {
    router.push({ name: "AddArticle" });
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