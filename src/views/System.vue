<template>
    <div class="system-container">
        <div class="system-info-section">
            <div class="title">
                <span>后台统计</span>
            </div>
            <div class="info-content">
                <div class="web-item" @click="goPage(article.path)">
                    <div class="icon">
                        <img src="../assets/images/web-icon-01.png" alt="">
                    </div>
                    <div class="info">
                        <div class="h3">文章发布</div>
                        <div class="p">{{article.total}}<span>篇</span> </div>
                    </div>
                </div>
                <div class="web-item">
                    <div class="icon">
                        <img src="../assets/images/web-icon-02.png" alt="">
                    </div>
                    <div class="info">
                        <div class="h3">文章发布</div>
                        <div class="p">{{product.total}}<span>个</span> </div>
                    </div>
                </div>
                <div class="web-item" @click="goPage(banner.path)">
                    <div class="icon">
                        <img src="../assets/images/web-icon-03.png" alt="">
                    </div>
                    <div class="info">
                        <div class="h3">轮播图</div>
                        <div class="p">{{banner.total}}<span>个</span> </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script  lang="ts" setup>
import { reactive, ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const article = reactive({
    total: 0,
    path: 'ArticleList'
})
const product = reactive({
    total: 0,
    path: ''
})
const banner = reactive({
    total: 0,
    path: 'BannerList'
})
onMounted(()=>{
    getArticleCount();
    getBannerCount()
})
//查询文章总数量
const getArticleCount = () => {
    //获取查询条件
    let params = {};

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
                article.total = result.data.data[0].count;
            }

        })
        .catch((error) => {
            console.log("error", error);
        });
};
  //查询文章总数量
  const getBannerCount = () => {
  //获取查询条件
  let params = {};
 
  proxy.$axios
    .get("/bannerCount", {
      params,
      headers: {
        token: document.cookie,
      },
    })
    .then((result) => {
      if (result.data.status == 1041) {
        return router.push({ name: "Login" });
      }
      if (result.data.status == 1300) {
        banner.total = result.data.data[0].count;
      }
      
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const goPage = (path) => {
    router.push({ name: path })
}
</script>
<style type="text/css" lang="less">
@m1: #409eff;

.system-container {
    padding: 0 12px;
    background: #fff;

    .title {
        height: 47px;
        overflow: hidden;
        border-bottom: 1px solid #EBEFF7;
        margin-bottom: 20px;

        span {
            display: block;
            font-weight: 400;
            margin-top: 16px;
            height: 17px;
            line-height: 17px;
            border-left: 3px solid #4097F5;
            color: #263444;
            font-size: 14px;
            padding-left: 11px;
        }
    }

    .info-content {
        display: flex;
        flex-wrap: wrap;

        .web-item {
            overflow: hidden;
            margin: 0 10px 20px;
            display: flex;
            cursor: pointer;

            &:nth-of-type(1) {
                .icon {
                    background: @m1;
                }
            }

            &:nth-of-type(2) {
                .icon {
                    background: #fdad4d;
                }
            }
            &:nth-of-type(3) {
                .icon {
                    background: #fd7b4d;
                }
            }

            .icon {
                width: 90px;
                height: 90px;
                font-size: 0;
                line-height: 90px;
                text-align: center;
                overflow: hidden;

                img {
                    display: inline-block;
                    vertical-align: middle;
                    max-height: 100%;
                    max-width: 100%;
                }
            }

            .info {
                padding: 0 20px;
                width: 160px;
                height: 88px;
                border: 1px solid #ebeff7;
                border-left: none;
                border-right: none;
                background: #f4f7fd;

                .h3 {
                    color: #73797f;
                    font-size: 14px;
                    line-height: 1.2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin: 15px 0 15px;
                }

                .p {
                    font-size: 24px;
                    color: #01172d;
                    line-height: 1.2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: bold;

                    span {
                        font-size: 14px;
                        margin-left: 3px;
                    }
                }
            }
        }
    }
}
</style>