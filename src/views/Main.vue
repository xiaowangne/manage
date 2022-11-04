<template>
	  <el-container class="houtaiPage">
	      <el-header class="h-header">
            <nav-box></nav-box>
		  </el-header>
	      <el-container>
	        <el-aside width="200px" class="h-aside">
                <aside-menu></aside-menu>
			</el-aside>
	        <el-main>
                <router-view/>
			</el-main>
	      </el-container>
	    </el-container>
</template>
<script lang="ts" setup>
    import NavBox  from '../components/NavBox.vue'
     import AsideMenu  from '../components/AsideMenu.vue'
</script>
<style type="text/css" lang="less">
    html, body, #app{ height: 100%; margin: 0; padding: 0;overflow: hidden;}
	@m1: #409eff;
	.houtaiPage{
		height: 100%;
		.h-header{
			background: #237ed2;
			.title{
				color: #fff;
			}
		}
	
		.el-main{
			padding:15px;
			box-sizing: border-box;
			// min-width:1200px ;
            background: #e9ebec;
			height: calc(100vh - 60px);
			box-sizing: border-box;
		}
	}
</style>