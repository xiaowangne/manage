<template>
    <div class="aside-menu">
        <el-menu class="el-menu-vertical-demo" default-active="8" :unique-opened="true" @open="handleOpen"
            @close="handleClose" background-color="none" text-color="#dfdfdf" :router="true">
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <Tickets />
                    </el-icon>
                    <span>文章管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="articleList">
                        <el-icon>
                            <List />
                        </el-icon> <span>文章列表</span>
                    </el-menu-item>
                    <el-menu-item index="addArticle">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon> <span>添加文章</span>
                    </el-menu-item>
                    <el-menu-item index="articleTypeList">
                        <el-icon>
                            <Menu />
                        </el-icon> <span>文章分类</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
                <template #title>
                    <el-icon>
                        <Goods />
                    </el-icon>
                    <span>商品管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="2-1">
                        <el-icon>
                            <List />
                        </el-icon> <span>商品列表</span>
                    </el-menu-item>
                    <el-menu-item index="2-2">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon> <span>添加商品</span>
                    </el-menu-item>
                    <el-menu-item index="2-3">
                        <el-icon>
                            <Menu />
                        </el-icon> <span>商品分类</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="3">
                <template #title>
                    <el-icon>
                        <List />
                    </el-icon>
                    <span>订单管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="3-1">
                        <el-icon>
                            <List />
                        </el-icon> <span>订单列表</span>
                    </el-menu-item>

                </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="4">
                <template #title>
                    <el-icon>
                        <Picture />
                    </el-icon>
                    <span>轮播管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="bannerList">
                        <el-icon>
                            <List />
                        </el-icon> <span>轮播列表</span>
                    </el-menu-item>
                    <el-menu-item index="addBanner">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon> <span>添加轮播</span>
                    </el-menu-item>
                    <el-menu-item index="bannerTypeList">
                        <el-icon>
                            <Menu />
                        </el-icon> <span>轮播分类</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="5">
                <template #title>
                    <el-icon>
                        <Histogram />
                    </el-icon>
                    <span>数据统计</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="7-1">
                        <el-icon>
                            <TrendCharts />
                        </el-icon><span>商品销售</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item index="6">
                <el-icon>
                    <Setting />
                </el-icon>
                <span>系统设置</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>

const handleOpen = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
}
</script>

<style type="text/css" lang="less" >
@m1: #237ed2;

.aside-menu {
    height: 100%;
    background: #1f2c3b;
    padding-top: 3px;
    box-sizing: border-box;

    .el-menu-vertical-demo {
        height: 100%;
        border-right: none;

        .el-menu-item {
            border-bottom: 1px solid #36424f;

            &:hover {
                background-color: #304155;
            }

            &.is-active {
                background-color: #304155;
            }
        }

        .el-sub-menu {

            .el-sub-menu__title {
                border-bottom: 1px solid #36424f;

                &:hover {
                    background-color: #304155;
                }

            }

            &.is-opened {
                .el-sub-menu__title {
                    background-color: #304155;
                }
            }

            &.is-active {
                .el-sub-menu__title {
                    background-color: #304155;
                    color: @m1;
                }
            }

            .el-menu {
                .el-menu-item-group {
                    background: #01172d;

                    .el-menu-item-group__title {
                        display: none;
                    }

                    .el-menu-item {
                        &:hover {
                            color: @m1;
                            background: none;
                        }

                        &.is-active {
                            background-color: #e9ebec;
                            color: @m1;
                        }
                    }
                }
            }
        }
    }
}
</style>
