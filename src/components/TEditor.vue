<template>
  <editor v-model="myValue" :init="init"  :id="tinymceId"></editor>
</template>
  
  
<script setup lang="ts">
//JS部分
//在js中引入所需的主题和组件
import tinymce from 'tinymce/tinymce'
import 'tinymce/skins/content/default/content.css'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom' // 这里是个坑 一定要引入


//在TinyMce.vue中接着引入相关插件
import "tinymce/icons/default/icons"
import "tinymce/plugins/image" // 插入上传图片插件
import "tinymce/plugins/media" // 插入视频插件
import "tinymce/plugins/table" // 插入表格插件
import "tinymce/plugins/lists" // 列表插件
import "tinymce/plugins/wordcount" // 字数统计插件
import "tinymce/plugins/code" // 源码
// import "tinymce/plugins/fullscreen" //全屏

//接下来定义编辑器所需要的插件数据
import { reactive, ref, getCurrentInstance } from "vue"
import { onMounted, defineEmits, watch } from "@vue/runtime-core"
import axios from 'axios'
const emits = defineEmits(["getContent"])

const { proxy } = getCurrentInstance() as any;
const serverUrl = proxy.$serverUrl;

//这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
const props = defineProps({
  value: {
    type: String,
    default: () => {
      return ""
    },
  },
  baseUrl: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  plugins: {
    type: [String, Array],
    default: "lists image media table  wordcount ",
  },//必填
  toolbar: {
    type: [String, Array],
    default:
      "codesample bold italic underline alignleft aligncenter alignright alignjustify | undo redo | formatselect | fontselect | fontsizeselect | forecolor backcolor | bullist numlist outdent indent | lists link table code | removeformat ",
  },//必填
})
//用于接收外部传递进来的富文本
const myValue = ref(props.value)
const tinymceId = ref("vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""))
//定义一个对象 init初始化
  // *富文本编辑图片上传配置*/
  const uploadConfig = {
  action: serverUrl + "/upload", // 必填参数 图片上传地址
  methods: "POST", // 必填参数 图片上传方式
  token: document.cookie, // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
  name: "img", // 必填参数 文件的参数名
  size: 2048, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon", // 可选 可上传的图片格式
};
const init = reactive({
  selector: '#' + tinymceId.value, //富文本编辑器的id,
  language_url: "./tinymce/langs/zh-Hans.js", // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language: "zh-Hans", //语言
  skin_url: "./tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
  height: 600, //编辑器高度
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: true, //顶部菜单栏显示
  image_dimensions: false, //去除宽高属性
  plugins: props.plugins,  //这里的数据是在props里面就定义好了的
  toolbar: props.toolbar, //这里的数据是在props里面就定义好了的
  font_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', //字体
  fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', //文字大小
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  paste_webkit_styles: "all",
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  file_picker_types: 'file',
  content_css: './tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  //图片上传

  images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    // xhr发送请求('请求类型','请求链接')
    xhr.open(uploadConfig.methods, uploadConfig.action,true)
    // 上传进度
    xhr.upload.onprogress = e => {
      progress(e.loaded / e.total * 10)
    }
    // 请求头加入jwt 看个人需求与后端约定判断
    // xhr.setRequestHeader('Authorization', 'Bearer ' + userStore.access_token)
    // 新建表单对象
    const formData = new FormData()
    // 表单增加(name值,二进制文件,文件名)
    // formData.append('f', blobInfo.blob(), blobInfo.filename())
    console.log(blobInfo.blob());
    
    formData.append("file", blobInfo.blob());
    // 在提交表单的载荷上另外携带数据,非必要只是个人项目需要
    // formData.append('data', { target: 'notice' })
    // 发送数据表单数据
     // 如果需要token且存在token
     if (uploadConfig.token) {
          formData.append("token", uploadConfig.token);
        }
    xhr.send(formData)
    // 请求完成执行
    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText)
        resolve( serverUrl + "/"+res.path)
      }
    }
    xhr.onerror = () => {
      reject('图像上传失败。代码： ' + xhr.status)
    }
  }),
    // 文件上传
    file_picker_callback: (callback, value, meta) => { 
    // Provide file and text for the link dialog
    if (meta.filetype == 'file') {
      callback('mypage.html', { text: 'My text' });
    }

    // Provide image and alt text for the image dialog
    if (meta.filetype == 'image') {
      callback('myimage.jpg', { alt: 'My alt text' });
    }

    // Provide alternative source and posted for the media dialog
    if (meta.filetype == 'media') {
      callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
    }
  }
})

//监听外部传递进来的的数据变化
watch(
  () => props.value,
  () => {
    myValue.value = props.value
    emits("getContent", myValue.value)
  }
)
//监听富文本中的数据变化
watch(
  () => myValue.value,
  () => {
    emits("getContent", myValue.value)
  }
)
//在onMounted中初始化编辑器
onMounted(() => {
  tinymce.init({})
})
</script>
  
  