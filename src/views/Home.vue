<template>
    <el-form-item label="图片">
        <el-upload list-type="picture-card" :auto-upload="false" :multiple="true"
            :limit="6" v-model:file-list="fileList" :on-change="handleChange" :on-preview="handlePictureCardPreview">
            <el-icon color="#999999">
                <Plus />
            </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="图片预览" />
        </el-dialog>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
    </el-form-item>
</template>

<script setup lang="ts" >
import { reactive, ref, getCurrentInstance } from 'vue'
import type { FormInstance, FormRules, UploadFile, UploadUserFile, UploadProps } from 'element-plus'

const { proxy } = getCurrentInstance() as any;
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const headers = { 'Content-Type': 'multipart/form-data' }
const fileList = reactive([]) as any;
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    // console.log(ruleForm.fileList);
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

const submitForm = () => {
    const formData = new FormData();
    fileList.forEach(item  => {
        formData.append('file', item.raw)
    })
    let config = {
        headers: {
            'Content-Type':'multipart/form-data'
        }
    }
    proxy.$axios.post('/upload', 
        formData,
        config
    ).then(result => {
        console.log('result!', result);
    }).catch(error => {
        console.log('error', error);
    });
}

</script>
