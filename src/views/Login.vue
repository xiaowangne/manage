<template>
	<div class="login-container" id="login">
		<el-form class="login-form " ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules">
			<h3 class="login_title">后台管理系统--登录</h3>
			<el-form-item prop="email">
				<el-input placeholder="邮箱" v-model="ruleForm.email"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" autocomplete="off" placeholder="密码" v-model="ruleForm.password"></el-input>
			</el-form-item>
			<!-- 防机器登录 -->
			<el-form-item prop="validCode" class="validCode">
				<el-input placeholder="验证码" v-model="ruleForm.validCode" :maxlength='4' @keyup.enter.prevent ="submitForm(ruleFormRef)"></el-input>
				<div class="code">
					<validate-code @onReceiveCode="onReceiveCode" ref="draw" ></validate-code >
				</div>
			</el-form-item>
			<el-form-item class="submit">
				<el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
			</el-form-item >
			<el-form-item class='res'><div class="p">尚未注册，<span @click="goPage()">去注册>></span></div></el-form-item>
			</el-form>

	</div>

</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
// 导入验证码组件
import  ValidateCode  from '../components/ValidateCode.vue';

const { proxy } = getCurrentInstance() as any;

const ruleFormRef = ref<FormInstance>();

const router=useRouter();
// 表单信息
const ruleForm = reactive({
	password: '',
	email: '',
	// 验证码
	validCode: '',
});

// 接收子组件中的验证码
const receiveCode = ref('');
const onReceiveCode = (params:string) => {
//   console.log(params);
  receiveCode.value = params;
}
// 接收子组件的draw方法
const draw=ref<any>();


// 邮箱验证
const checkEmail = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('邮箱不能为空'))
	} else {
		//邮箱正确
		let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if (!reg.test(value)) {
			callback(new Error('邮箱格式不正确'))
		} else {
			callback()
		}
	}
}

// 检查密码
const validatePass = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('密码不能为空'))
	} else {
		//密码支持字母数字下划线且首字母必须为字母(6~16位)
		let reg = /^[A-Za-z]\w{5,15}$/;
		if (!reg.test(value)) {
			callback(new Error('密码支持字母数字下划线且首字母必须为字母(6~16位)'))
		} else {
			callback()
		}
	}
}

// 检查验证码
const validateValidCode = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('验证码不能为空'))
	} else {
		//验证码验证 
		let reg = /^[[A-Za-z0-9]{4}$/;
		if (!reg.test(value)) {
			callback(new Error('验证码不正确'))
		} else {
			callback()
		}
	}
}

// 验证规则
const rules = reactive({
	password: [{ validator: validatePass, trigger: 'blur' }],
	email: [{ validator: checkEmail, trigger: 'blur' }],
	validCode: [{ validator: validateValidCode, trigger: 'blur' }]
})


// 提交登录表单
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			// 验证验证码是否正确
			if(ruleForm.validCode.toUpperCase()!=receiveCode.value){
				ElMessage({
						showClose: true,
						message: '验证码不正确',
						type: 'error',
					})
				draw.value.draw();
				ruleForm.validCode=''
				return;
			}
			proxy.$axios.post('/login', {
				email: ruleForm.email,
				password: ruleForm.password,
			}).then(result => {
				if (result.data.status === 1000) {
					  //保存cookies信息
                for(let key in result.data.data) {
                  proxy.$cookies.set(key, result.data.data[key], '1d');
                }
					ElMessage({
						showClose: true,
						message: result.data.msg,
						type: 'success',
					})
					// 登录成功跳转到首页
					router.push({name:'System'})

				} else {
					ElMessage({
						showClose: true,
						message: result.data.msg,
						type: 'error',
					})
					// 刷新验证码
					draw.value.draw();
					ruleForm.validCode='';
				}
			}).catch(error => {
				console.log('error', error);
				draw.value.draw();
				ruleForm.validCode='';
			});
		}
	})
}

const goPage=()=>{
	router.push({name:'Register'})
}

</script>

<style type="text/css" lang="less">

.login-container {
	height: 100vh;
	padding-top: 30vh;
	box-sizing: border-box;
	position: relative;
	background: url(../assets/images/login-bg.jpg) no-repeat center center;

	.login_title {
		margin: 0 auto 30px;
		text-align: center;
		color: #454545;
		font-size: 28px;
	}

	.login-form {
		border-radius: 15px;
		background: rgba(255, 255, 255, 0.4);
		background-clip: padding-box;
		max-width: 350px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
		margin: 0 auto;
		padding: 2vw 2.5vw;

		.el-input__inner {
			height: 40px;
			line-height: 40px;
			color: #454545;
			border: none;
		}

		.validCode {
			display: flex;

			.el-input {
				width: 200px;
			}

			.code {
				width: 140px;
				height: 40px;
				margin-left: 10px;
			}
		}

		.submit {
			.el-button {
				height: 40px;
				width: 100%;
				font-size: 16px;
				color: #fff;
			}
		}
		.res{
			margin-bottom: 0;
			.p{
				width: 100%;
				text-align: center;
				span{
					color: #000000;
					cursor: pointer;
				}
			}
			
		}

	}
}


// 按钮

.rotate(@rotate) {
	-webkit-transform: rotate(@rotate);
	-moz-transform: rotate(@rotate);
	-ms-transform: rotate(@rotate);
	-o-transform: rotate(@rotate);
	transform: rotate(@rotate);
}

.transition(@transition: .4s) {
	-webkit-transition: @transition;
	-moz-transition: @transition;
	-ms-transition: @transition;
	-o-transition: @transition;
	transition: @transition;
}

.btn-2 {
	position: relative;
	overflow: hidden;
	.transition(all .8s);
	display: block;
	z-index: 1;
}

.btn-2:before {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 0 0 0 0;
	border-color: transparent transparent transparent rgba(255, 255, 255, 0.1);
	.rotate(360deg);
	.transition(all .6s);
	z-index: -1;
}

.btn-2:after {
	border-style: solid;
	content: '';
	width: 0;
	height: 0;
	border-width: 0 0 0 0;
	border-color: transparent rgba(255, 255, 255, 0.1) transparent transparent;
	position: absolute;
	right: 0;
	top: 0;
	.rotate(360deg);
	.transition(all .6s);
	z-index: -1;
}

.btn-2:hover:before {
	border-width: 600px 0 0 600px;
}

.btn-2:hover:after {
	border-width: 0 600px 600px 0;
}
</style>