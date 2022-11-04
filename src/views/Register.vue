<template>
	<div class="login-container" id="register">
		<el-form class="login-form " ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules">
			<h3 class="login_title">后台管理系统--注册</h3>
			<el-form-item prop="email">
				<el-input placeholder="邮箱" v-model="ruleForm.email"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" autocomplete="off" placeholder="密码" v-model="ruleForm.password"></el-input>
			</el-form-item>
			<el-form-item prop="checkPass">
				<el-input type="password" autocomplete="off" placeholder="确认密码" v-model="ruleForm.checkPass"></el-input>
			</el-form-item>
			<el-form-item prop="validCode" class="validCode">
				<el-input placeholder="验证码" v-model="ruleForm.validCode" :maxlength='6'></el-input>
				<el-button :disabled="sendInfo.isSend" @click="clickSend()">{{ sendInfo.text }}</el-button>
			</el-form-item>
			<el-form-item class="submit">
				<el-button type="primary" @click="submitForm(ruleFormRef)">注册</el-button>
			</el-form-item>
			<el-form-item class='res'><div class="p">已有账号，<span @click="goPage()">去登录>></span></div></el-form-item>
		</el-form>
	</div>
	<el-dialog v-model="dialogValid" width="350px" :close-delay='500'>
		<slide-verify ref="block" :imgs="validImgs" :slider-text="text" :accuracy="accuracy" @again="onAgain"
			@success="onSuccess" @fail="onFail" @refresh="onRefresh"></slide-verify>
		<div class="valid-msg">{{ msg }}</div>
	</el-dialog>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
// 导入安全验证组件
import SlideVerify, { SlideVerifyInstance } from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";

const { proxy } = getCurrentInstance() as any;

const router = useRouter();
// 弹出框
const dialogValid = ref(false);
// 验证信息
const msg = ref("");
const text = '向右滑动->';
// 滑块验证差值
const accuracy = 3;
const block = ref<SlideVerifyInstance>();
// 验证背景图片
const validImgs = ref([]) as any;

const onAgain = () => {
	msg.value = "检测到非人为操作的哦！";
	// 刷新
	block.value?.refresh();
};
const onSuccess = (times: number) => {
	msg.value = `验证成功, 耗时${(times / 1000).toFixed(1)}s`;
	dialogValid.value = false;
	sendValidate();
	let timer1 = setInterval(() => {
		block.value?.refresh();
		clearInterval(timer1);
	}, 1000);
};
const onFail = () => {
	msg.value = "验证失败，请重试";
};
const onRefresh = () => {
	msg.value = "";
};
// 验证图片
const addImg = () => {
	for (let i = 1; i <= 10; i++) {
		validImgs.value.push('src/assets/images/verifyImgs/' + i + '.jpg')
	}
}

onMounted(() => {
	addImg();
})

const ruleFormRef = ref<FormInstance>();
// 表单信息
const ruleForm = reactive({
	password: '',
	checkPass: '',
	email: '',
	// 验证码
	validCode: '',
});

// 发送按钮
const sendInfo = reactive({
	text: '发送验证码',
	isSend: false,
	// 验证码id
	codeId: ''
});


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

// 确认密码
const validatePass2 = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请再次输入密码'))
	} else if (value !== ruleForm.password) {
		callback(new Error("两次密码不一致!"))
	} else {
		callback()
	}
}

// 检查验证码
const validateValidCode = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('验证码不能为空'))
	} else {
		//验证码验证
		let reg = /^\d{6}$/;
		if (!reg.test(value)) {
			callback(new Error('输入6位数字验证码'))
		} else {
			callback()
		}
	}
}

// 验证规则
const rules = reactive({
	password: [{ validator: validatePass, trigger: 'blur' }],
	checkPass: [{ validator: validatePass2, trigger: 'blur' }],
	email: [{ validator: checkEmail, trigger: 'blur' }],
	validCode: [{ validator: validateValidCode, trigger: 'blur' }]
})


// 点击发送验证码验证
const clickSend = () => {
	let emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	if (!emailReg.test(ruleForm.email)) {
		ElMessage({
			showClose: true,
			message: '邮箱格式不正确',
			type: 'error',
		})
		return;
	}
	// 弹出验证框
	msg.value = "";
	dialogValid.value = true;
}

//发送验证码
const sendValidate = () => {
	let time = 120;
	// 发送验证码请求
	proxy.$axios.post('/sendEmail', {
		email: ruleForm.email
	}).then(result => {
		if (result.data.status == 1010) {
			sendInfo.codeId = result.data.data.codeId;
			sendInfo.text = time + 's后重新发送';
			sendInfo.isSend = true
			let timer: any = setInterval(() => {
				if (time == 0) {
					clearInterval(timer);
					timer = null;
					sendInfo.text = '发送验证码';
					sendInfo.isSend = false
				} else {
					time--;
					sendInfo.text = time + 's后重新发送';
				}
			}, 1000);
			ElMessage({
				showClose: true,
				message: result.data.msg,
				type: 'success',
			})
		} else {
			ElMessage({
				showClose: true,
				message: result.data.msg,
				type: 'error',
			})
		}
	}).catch(error => {
		console.log('error', error)
	});
}

// 提交注册表单
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			if (sendInfo.codeId == '') {
				ElMessage({
					showClose: true,
					message: '请发送验证码',
					type: 'error',
				})
				return
			};
			proxy.$axios.post('/register', {
				email: ruleForm.email,
				password: ruleForm.password,
				validCode: ruleForm.validCode,
				codeId: sendInfo.codeId
			}).then(result => {
				if (result.data.status === 1000) {
					ElMessage({
						showClose: true,
						message: result.data.msg,
						type: 'success',
					})
					// 跳转到登录页面
					router.push({ name: 'Login' })
				} else {
					ElMessage({
						showClose: true,
						message: result.data.msg,
						type: 'error',
					})
					ruleForm.validCode = '';
				}
			}).catch(error => {
				ruleForm.validCode = '';
				console.log('error', error)
			});
		}
	})
}
const goPage=()=>{
	router.push({name:'Login'})
}


</script>

<style type="text/css" lang="less">
.slide-verify-slider {
	margin-top: 0 !important;
}

.valid-msg {
	line-height: 30px;
	color: #d41925;
}

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
				width: 180px;
			}

			.el-button {
				width: 160px;
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