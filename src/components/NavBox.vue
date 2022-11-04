<template>
  <div class="manage-header">
    <div class="manage-logo">商家后台</div>
    <div class="manage-navbar">
      <div class="avatar">
        <img :src="userInfo.avatar" alt="" />
      </div>
      <div class="drop-down-menu">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userInfo.nickName }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Key">修改密码</el-dropdown-item>
              <el-dropdown-item :icon="SwitchButton" @click="exitLogin">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { ArrowDown, Key, SwitchButton } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
// 退出登录
const router = useRouter();

const { proxy } = getCurrentInstance() as any;

// 服务器地址
const serverUrl = proxy.$serverUrl;


//用户信息
const userInfo = reactive({
  nickName: "",
  avatar: "",
});
// 页面加载执行
onMounted(() => {
    getUserInfo();
});

const getUserInfo = () => {
  //获取查询条件
  proxy.$axios
    .get("/userInfo", {
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }
      if (result.data.status == 1120) {
        let data = result.data.data[0];
        userInfo.nickName=data.nickName;
        userInfo.avatar=serverUrl + '/' + data.avatar
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const exitLogin = () => {
  ElMessageBox.confirm("是否确认退出?", "请注意", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "退出成功",
      });

      //   router.push({ name: "Login" });
    })
    .catch(() => {
      //   ElMessage({
      //     type: 'info',
      //     message: 'Delete canceled',
      //   })
    });
};
</script>

<style type="text/css" lang="less">
@m1: #237ed2;

.block-col-2 .demonstration {
  display: block;
  color: #fff;
  font-size: 14px;
  margin-bottom: 20px;
}

.manage-header {
  height: 100%;
  display: flex;
  align-items: center;

  .manage-logo {
    font-size: 20px;
    font-weight: bold;
  }

  .manage-navbar {
    margin-left: auto;
    display: flex;
    align-items: center;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: darkorange;
      margin-right: 15px;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .drop-down-menu {
      .el-dropdown {
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>