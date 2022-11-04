<template>
    <canvas ref="canvas" @click="draw" width="140" height="40" style="cursor: pointer"></canvas>
</template>
<script setup lang="ts" >
import { reactive, ref,onMounted } from 'vue';
const codes = ref([]) as any;
const validCode=ref('');
const ctx = ref('') as any;
const colors = ref(["red", "brown", "blue", "green", "pink", "black"]);
const code_Len = ref(4);
 const canvas = ref() as any;
onMounted(()=>{
	draw();
})

interface EmitType {
  (e: "onReceiveCode", params: string): void
}
const emit = defineEmits<EmitType>();

const sendCode = () => {
  // 传validCode给父组件
  emit("onReceiveCode", validCode.value);
}

const generateRandom = () => {
    codes.value = [];
    const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const charsArr = chars.split("");
    for (let i = 0; i < code_Len.value; i++) {
        const num = Math.floor(Math.random() * charsArr.length);
        codes.value.push(charsArr[num]);
    }
};
const draw = () => {
    generateRandom();
    drawText();
    sendCode();
    // console.log(validCode.value);
};
defineExpose({ draw });

// 获取生成验证码
const codeString=()=> {
    validCode.value=''
      for (let i = 0; i < codes.value.length; i++) {
          validCode.value += codes.value[i];
      }
    //   全部转为大写
    validCode.value = validCode.value.toUpperCase();
}

// 生成画布线条
const drawLine = () => {
    const lineNumber = 2; // 线条条数
    const lineX = 140;
    const lineY = 30; // 最大线条坐标
    for (let i = 0; i < lineNumber; i++) {
        ctx.value.strokeStyle = colors.value[Math.floor(Math.random() * 5)];
        ctx.value.beginPath();
        ctx.value.moveTo(
            Math.floor(Math.random() * lineX),
            Math.floor(Math.random() * lineY)
        );
        ctx.value.lineTo(
            Math.floor(Math.random() * lineX),
            Math.floor(Math.random() * lineY)
        );
        ctx.value.stroke();
    }
};
// 生成画布验证码
const drawText = () => {
    ctx.value = canvas.value.getContext("2d");
    ctx.value.fillStyle = "#f3fbfe";
    ctx.value.fillRect(0, 0, 140, 40);
    ctx.value.font = "20px Verdana";
    let x = 15;
    for (let i = 0; i < code_Len.value; i++) {
        ctx.value.fillStyle = colors.value[Math.floor(Math.random() * 5)];
        ctx.value.fillText(codes.value[i], x, 25);
        x = x + 30;
    }
    drawLine();
    codeString();
}

</script>
