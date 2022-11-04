<template>
    <div class="back-section">
        <div class="title">
            <i></i>
            <span>{{props.title}}</span>
        </div>
        <div class="back" @click="back">
            <span>{{ props.text }}</span><el-icon><ArrowRight /></el-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const props = defineProps({
    text: {
        type: String,
        default: '返回'
    },
    title: {
        type: String,
        default: '添加分类'
    }
});
const router = useRouter();
const back = () => {
    router.go(-1);
}
</script>

<style type="text/css" lang="less">
@m1: #409eff;

.back-section {
    padding: 15px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            color: @m1;
        }

        span {
            margin-right: 2px;
            line-height: 1;
        }
    }
    .title{
        display: flex;
        align-items: center;
        i{
            width: 3px;
            height: 18px;
            background: @m1;
            margin-right: 8px;
        }
        span{
            line-height: 1;
        }
    }
}
</style>