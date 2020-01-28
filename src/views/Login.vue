<template>
	<div id="login_container">
		<template1 v-if="tempalteFlag ==1">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item>
					<!-- <img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /> -->
					</el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-mobile-phone fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-key fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-key fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template1>

		<template2 v-if="tempalteFlag ==2" class="template2">
			<el-form :model="ruleForm" :rules="rules" style="margin:0 auto;margin-top:60px;" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<!-- <el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item> -->
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-key fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-key fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template2>
		
		<template3 v-if="tempalteFlag ==3" class="template3">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<!-- <el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item> -->
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-key fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-key fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template3>
		
		<template4 v-if="tempalteFlag ==4" class="template4">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<!-- <el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item> -->
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template4>

		<template5 v-if="tempalteFlag ==5" class="template5">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<!-- <el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item> -->
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template5>

		<template6 v-if="tempalteFlag ==6"  class="template6">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<!-- <el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item> -->
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template6>

		<template7 v-if="tempalteFlag ==7" class="template7">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template7>

		<template8 v-if="tempalteFlag ==8" class="template8">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-mobile-phone fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template8>

		<template9 v-if="tempalteFlag ==9" :imgUrl="LogInLogo" class="template9">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-mobile-phone fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template9>

		<template10 v-if="tempalteFlag ==10" :imgUrl="LogInLogo" class="template10">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="border-radius: 20px; width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template10>

		<template11 v-if="tempalteFlag ==11" class="template11">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template11>
		
		<template12 v-if="tempalteFlag ==12" :imgUrl="LogInLogo" class="template12">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template12>

		<template13 v-if="tempalteFlag ==13" :imgUrl="LogInLogo" class="template13">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template13>
		<template14 v-if="tempalteFlag ==14" :imgUrl="LogInLogo" class="template14">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template14>
		<template15  v-if="tempalteFlag ==15" :imgUrl="LogInLogo" class="template15">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item>
					<img :src="LogInLogo" style=" display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" />
					<!-- <p v-if="Merchant" style="text-align:center;font-size:66px;color:#ffffff;margin-bottom:30px;">{{Merchant}}</p> -->
				</el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user-o fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template15>
		<template16 v-if="tempalteFlag ==16" class="template16">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item>
					<img :src="LogInLogo" style=" display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" />
					<!-- <p v-if="Merchant" style="text-align:center;font-size:66px;color:#ffffff;margin-bottom:30px;">{{Merchant}}</p> -->
				</el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template16>
		<template17 v-if="tempalteFlag ==17" class="template17">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item>
					<img :src="LogInLogo" style=" display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" />
					<!-- <p v-if="Merchant" style="text-align:center;font-size:66px;color:#ffffff;margin-bottom:30px;">{{Merchant}}</p> -->
				</el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template17>
		<template18 v-if="tempalteFlag ==18" class="template18">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="0px"  @submit.native.prevent>
				<el-form-item>
					<img :src="LogInLogo" style=" display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" />
					<!-- <p v-if="Merchant" style="text-align:center;font-size:66px;color:#ffffff;margin-bottom:30px;">{{Merchant}}</p> -->
				</el-form-item>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-user fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template18>

		<template19 v-if="tempalteFlag ==19" class="template19" :imgUrl="LogInLogo">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" style="padding:0 40px 0 40px;" label-width="0px"  @submit.native.prevent>
				<!-- <el-form-item><img :src="LogInLogo" style="display:block; padding:10px 20px; margin:20px auto; border-radius:5px;" /></el-form-item> -->
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-mobile-phone fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template19>
		<template20 v-if="tempalteFlag ==20" class="template20" :imgUrl="LogInLogo">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" style="padding:0 40px 0 40px;" label-width="0px"  @submit.native.prevent>
				<el-form-item prop="account">
					<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入用户名" @blur="blurYZ">
						<template slot="prepend"><i class="fa fa-mobile-phone fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-if="visible">
					<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="checkPass" v-else>
					<el-input type="text" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请输入密码">
						<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
						<template slot="prepend"><i class="fa fa-lock fa-fw fa-lg"></i></template>
					</el-input>
				</el-form-item>
				<el-form-item prop="gtData" v-if="isgeetest">
					<div id="captcha"></div>
				</el-form-item>
				<el-checkbox v-model="checked" class="remember">保持登录状态</el-checkbox>
				<el-form-item :class="{footer:!isgeetest}">
					<el-button type="primary" @click="handleSubmit2" :loading="logining" style="width:100%; height:45px; background:#2467e2;">立即登录<i class="fa fa-long-arrow-right" style="margin-left:10px;"></i></el-button>
				</el-form-item>
			</el-form>
		</template20>
		<!-- 添加/编辑弹框 -->
		<el-dialog title="提 示" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" @close="$set(ruleForm,'VerifyCode','')" width="500px" top="30vh">
			<el-form :model="ruleForm" label-width="105px" ref="ruleForm" style="width:100%;" @submit.native.prevent>
				<el-form-item label="请输入验证码">
					<el-input v-model="ruleForm.VerifyCode" placeholder="请输入" auto-complete="off" clearable style="width:80%;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="submittwo">确定</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { loginconf,userLogin,validauthconf,validregist,validverify,getmenulist } from 'api/api.js';
	import MenuUtils from 'utils/MenuUtils.js';
	import tools from 'utils/common.js';
	import gt from 'utils/gt.js'
	import http from "../api/http.js";
	import template1 from 'components/login_template/template_1.vue';
	import template2 from 'components/login_template/template_2.vue';
	import template3 from 'components/login_template/template_3.vue';
	import template4 from 'components/login_template/template_4.vue';
	import template5 from 'components/login_template/template_5.vue';
	import template6 from 'components/login_template/template_6.vue';
	import template7 from 'components/login_template/template_7.vue';
	import template8 from 'components/login_template/template_8.vue';
	import template9 from 'components/login_template/template_9.vue';
	import template10 from 'components/login_template/template_10.vue';
	import template11 from 'components/login_template/template_11.vue';
	import template12 from 'components/login_template/template_12.vue';
	import template13 from 'components/login_template/template_13.vue';
	import template14 from 'components/login_template/template_14.vue';
	import template15 from 'components/login_template/template_15.vue';
	import template16 from 'components/login_template/template_16.vue';
	import template17 from 'components/login_template/template_17.vue';
	import template18 from 'components/login_template/template_18.vue';
	import template19 from 'components/login_template/template_19.vue';
	import template20 from 'components/login_template/template_20.vue';
	export default {
		components:{template1,template2,template3,template4,template5,template6,template7,template8,template9,template10,template11,template12,template13,template14,template15,template16,template17,template18,template19,template20},
		data() {
			return {
				tempalteFlag:0,
				rst:{},
				LogInLogo:'',
				Merchant:'',
				showDialog:false,
				b:new http.Base64(),
				logining: false,
				ruleForm: {
					account: '',
					checkPass: '',
					VerifyCode:'',
					gtData:null
//					Token:''
				},
				rules: {
					account: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					checkPass: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					gtData: [{
						required: true,
						message: '请先进行验证',
						trigger: 'blur'
					}]
//					Token: [{
//						required: true,
//						message: '请先进行验证',
//						trigger: 'blur'
//					}]
				},
				checked:true,
				visible:true,
				isgeetest:false,
				geetest_success:null,
			};
		},
		mounted(){
			this.keyupSubmit();  //回车登录
			this.getsDtl();
		},
		methods: {
			getsDtl(){
				let userAccount = localStorage.getItem("account") || null;
				let userCheckPass = localStorage.getItem("checkPass") || null;
				loginconf({Domain:window.location.href}).then(res => {
					if( res.Ret==200 ){
						this.tempalteFlag = res.Rst.BackTempId || 1;
						if( res.Rst.Title ){
							document.title=res.Rst.Title;
						}
						if( res.Rst.AppIconUrl ){
							document.getElementById('icon').href=res.Rst.AppIconUrl;
						}
						if( res.Rst.LogInLogo ){
							this.LogInLogo=res.Rst.LogInLogo;
						}
						if( res.Rst.Merchant ){
							this.Merchant = res.Rst.Merchant;
							this.rst=res.Rst;
							this.geetest( this.rst.Merchant );
							if( userAccount&&userCheckPass ){
								this.ruleForm.account = this.b.decode(userAccount);
								this.ruleForm.checkPass = this.b.decode(userCheckPass);
								this.checked = true;
							}
						}else{
							if( userAccount&&userCheckPass ){
								if( this.b.decode(userAccount).indexOf('@')==-1 ){
									return false;
								}
								this.ruleForm.account = this.b.decode(userAccount);
								this.ruleForm.checkPass = this.b.decode(userCheckPass);
								this.checked = true;
								this.geetest(this.ruleForm.account.split('@')[1]);
							}
						}
					}
				});
			},
			blurYZ(){
//				if( this.rst.Merchant&&this.ruleForm.account.indexOf('@')!=-1  ){
//					this.$message.error( "账号格式输入有误" );
//					return false;
//				}
				if( this.rst.Merchant ){
					this.geetest( this.rst.Merchant );
					return false;
				}
				if( this.ruleForm.account.indexOf('@')==-1 ){
					this.$message.error( "账号格式输入有误" );
					this.ruleForm.account='';
					return false;
				}
				this.geetest(this.ruleForm.account.split('@')[1]);
			},
			geetest(m){
				validauthconf({Merchant:m}).then(res => {
                	console.log(res);
					if( res.Ret==200 ){
						if( res.IsGt ){
							this.isgeetest=true;
							this.gtVerify();
						}else{
							this.isgeetest=false;
						}
					}else{
						this.isgeetest=false;
						this.ruleForm.account='';
						this.ruleForm.checkPass='';
						localStorage.removeItem('account');
						localStorage.removeItem('checkPass');
					}
				});
			},
			submittwo(){  //输入将军令
				if( !this.ruleForm.VerifyCode ){
					this.$message.error( "请输入验证码！" );
					return false;
				}
				this.handleSubmit2();
			},
			gtVerify(){  //获取极验参数
                let that = this;
                validregist({}).then(res => {
                	console.log(res,12);
					if( res.Ret==200 ){
						that.geetest_success = res.success;
                        window.initGeetest({
                            gt:res.gt,
                            challenge:res.challenge,
                            offline:!res.success, // 表示用户后台检测极验服务器是否宕机
                            new_captcha:res.new_captcha, // 用于宕机时表示是新验证码的宕机
                            product:"float", // 产品形式，包括：float，popup
                            width:"290px"
                        },that.handlerFn);
					}else{
						that.gtVerify();
					}
				});
            },
            handlerFn(captchaObj){  //渲染极验效果并验证
            	let that=this;
				let captcha = document.getElementById("captcha");
			    while( captcha.hasChildNodes() ){
			        captcha.removeChild( captcha.firstChild );
			    }
            	captchaObj.appendTo('#captcha');
                captchaObj.onReady(function(){
                	
                }).onSuccess(function(){
                    let res = captchaObj.getValidate();
                    that.ruleForm.gtData=null;
                    console.log(res);
                    if( !res ){
                        this.$message.error( "请先完成认证！" );
                        return false;
                    }
                    that.ruleForm.gtData=res;
//					validverify({geetest_challenge:res.geetest_challenge,geetest_seccode:res.geetest_seccode,geetest_validate:res.geetest_validate,gt_server_status:that.geetest_success}).then(res => {
//	                	console.log(res);
//						if( res.Ret==200 ){
//							that.ruleForm.Token=res.Token;
//						}else{
//							that.ruleForm.Token='';
//						}
//					});
                });
            },
			keyupSubmit(){  //回车登录
			  	document.onkeydown=e=>{
			    	let _key=window.event.keyCode;
				    if(_key===13){
				    	this.handleSubmit2();
				    }
				}
			},
			handleSubmit2(){  //登录
				let that=this;
				this.$refs.ruleForm.validate((valid) => {
					if(valid) {
						if( that.ruleForm.account.indexOf('@')==-1&&!this.rst.Merchant ){
							that.$message.error( "账号格式输入有误!" );
							return false;
						}
						if( that.ruleForm.account.split('@')[1]=="ygqb" ){
							if( this.ruleForm.checkPass==123456 ){
								window.location.href="http://admin1.saaspd.com/#/main";
							}else{
								this.$message.error("密码错误");
							}
							return false;
						}
						let loginParams = {
//							Account: this.ruleForm.account,
							Pwd: this.ruleForm.checkPass,
							VerifyCode:this.ruleForm.VerifyCode,
//							Token:this.ruleForm.Token
						};
						if( this.rst.Merchant ){
							let accountArr=this.ruleForm.account.split('@');
							if( accountArr.length>1&&accountArr[1]!=this.rst.Merchant || accountArr.length>2 ){
								that.$message.error( "账号输入有误!" );
								return false;	
							}
							loginParams.Account=accountArr[0]+'@'+this.rst.Merchant;
						}else{
							loginParams.Account=this.ruleForm.account;
						}
						this.logining = true;
						if( that.ruleForm.gtData ){
							loginParams.geetest_challenge=that.ruleForm.gtData.geetest_challenge;
							loginParams.geetest_seccode=that.ruleForm.gtData.geetest_seccode;
							loginParams.geetest_validate=that.ruleForm.gtData.geetest_validate;
							loginParams.gt_server_status=that.geetest_success;
						}else{
							loginParams.geetest_challenge=null;
							loginParams.geetest_seccode=null;
							loginParams.geetest_validate=null;
							loginParams.gt_server_status=null;
						}
						loginParams.Browser = tools.getBrowser() || "未知";
						loginParams.NetType = tools.getNetworkType() || "未知";
						loginParams.System = window.navigator.platform || "未知";
						loginParams.Device = tools.getSystemInfo();
						userLogin(loginParams).then(res => {
							this.logining = false;
							if( res.Ret==100 ){
								this.showDialog=true;
								return false;
							}
							if( res.Ret==200 ){
								that.ruleForm.gtData=null;
								sessionStorage.setItem('userDtl',JSON.stringify(res.SysUserInfo));
								sessionStorage.setItem('Token',res.Token);
								sessionStorage.setItem('Xtn',res.Xtn);
								if(this.checked) {
									localStorage.setItem('account',this.b.encode(this.ruleForm.account));
									localStorage.setItem('checkPass',this.b.encode(this.ruleForm.checkPass));
								} else {
									localStorage.removeItem('account');
									localStorage.removeItem('checkPass');
								}
								this.showDialog=false;
								this.ruleForm.VerifyCode='';
								this.menuNav();
							}else{
								this.$set(this.ruleForm,'VerifyCode','');
								this.ruleForm.gtData=null;
								this.getsDtl();
							}
						});
					} else {
						return false;
					}
				});
			},
			menuNav(){  //获取左侧菜单
				let that = this;
				let params = {}
				getmenulist(params).then(res => {
					if( res.Ret == 200) {
						let priData={};
						if( res.Menus!=null ){
							priData = res.Menus;
							priData = JSON.stringify(priData).toLowerCase(); //所有的key转换成小写
							sessionStorage.setItem('meundata',priData);
						}
						that.$router.options.routes=[];
						let routes = [];
						if( priData.length>0 ){
							MenuUtils(routes,priData);
							that.$router.options.routes = Object.assign(that.$router.options.routes,routes);
							that.$router.addRoutes(routes);
						}
						that.$router.push({
							path: '/main'
						});
					} else {
						this.navlists = null;
					}
				});
			},
			changePass(value){  //判断是否保存登录状态
	        	this.visible = !(value === 'show');
	     	}
		}
	}
</script>

<style lang="scss">
	#login_container{ display:flex; width:100%; height:100%; min-width:1200px; min-height:800px; position:relative; overflow:hidden;
	background: url(../assets/img/bg.png) no-repeat;
	background-size: 100% 100%;
	//  background-attachment:fixed;
	// background-size: cover;
		.remember{ margin-bottom:25px;color: #fff}
		.el-form{ width:290px}
		.swiper1{ height:100%; background:url(https://static.****.com/static/img/swiper1.png) no-repeat center center; background-size:cover; }
		.swiper2{ height:100%; background:url(https://static.****.com/static/img/swiper2.png) no-repeat center center; background-size:cover; }
		input:-webkit-autofill{ -webkit-box-shadow:0 0 0px 1000px white inset; }
		.template2{
			.el-input-group__append,.el-input-group__prepend{ background-color:rgba(255,255,255,0.8); color:#5a6f8d; border:none; }
			.el-input.el-input-group.el-input-group--prepend input{background-color:rgba(255,255,255,0.8);color:#5a6f8d;border:none;}
			.el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color:#5a6f8d;border-color:#5a6f8d;}
			.el-checkbox__inner::after{border-color:#ffffff;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color:rgb(51,51,51);}
			.el-form-item__content .el-input-group,.el-form-item__label, .el-tag .el-icon-close{vertical-align:middle;border-bottom:1px solid #989ba4;}
			input::-webkit-input-placeholder{color:#595959 !important;}
			.el-button--primary{background:#5a6f8d !important;border:none;}	
		}
		.template3{
			.el-input-group__append, .el-input-group__prepend{background-color: rgba(255, 255, 255, 0.8);color: #567aff;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background-color: rgba(255, 255, 255, 0.8);color: #567aff;border: none;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color: #567aff;border-color: #567aff;}
			.el-checkbox__inner::after{border-color:  #ffffff;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #acacac;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-bottom: 1px solid #989ba4;}
			input::-webkit-input-placeholder {color: #595959 !important;}
			.el-button--primary{background: #567aff !important;border: none;}	
		}
		.template4{
			.el-input-group__append, .el-input-group__prepend{background: #f3f3f3;color: #333333;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: #f3f3f3;color: #333333;border: none;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #989ba4;border-radius: 4px;}
			input::-webkit-input-placeholder {}
			.el-button--primary{background: #2a9cfe !important;border: none;}	
		}
		.template5{
			.el-input-group__append, .el-input-group__prepend{background: #f3f3f3;color: #333333;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: #f3f3f3;color: #333333;border: none;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #989ba4;border-radius: 4px;}
			input::-webkit-input-placeholder {}
			.el-button--primary{background: #2a9cfe !important;border: none;}	
		}
		.template6{
			.el-input-group__append, .el-input-group__prepend{background: rgba(#ffffff, 0.2);color: #2e8ffb;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: rgba(#fff, 0.2);border: none;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color:#96c7fd;border-color: #fcf7ea;}
			.el-checkbox__inner::after{}
			.el-checkbox__label{color: #b6b6b6;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #b6b6b6;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-bottom: 1px solid #989ba4;}
			input::-webkit-input-placeholder {}
			.el-button--primary{background: #2e8ffb !important;border: none;}	
		}
		.template7{
			.el-input-group__append, .el-input-group__prepend{background: rgba(#ffffff, 0.2);color: #ffc202;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: rgba(#fff, 0.2);border: none;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color:#ffe080;border-color: #ffe080;}
			.el-checkbox__inner::after{}
			.el-checkbox__label{color: #b6b6b6;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #b6b6b6;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-bottom: 1px solid #989ba4;}
			input::-webkit-input-placeholder {}
			.el-button--primary{background: #ffc201 !important;border: none;color: #5c5029;}	
		}
		.template8{
			.el-input-group__append, .el-input-group__prepend{background: #ffffff;color: #333333;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: #ffffff;color: #333333;border: none;}
			.el-checkbox__inner{border-radius: 50%;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{border-radius: 50%;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #989ba4;border-radius: 4px;}
			input::-webkit-input-placeholder {}
			.el-button--primary{background: #ff6803 !important;border: none;}	
		}
		.template9{
			.el-input-group__append, .el-input-group__prepend{background: rgba(#ffffff, 0.2);color: #999999;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: rgba(#fff, 0.2);border: none;}
			.el-checkbox__inner{border-radius: 50%;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{border-radius: 50%;background-color:#4b4a63;border-color: #4b4a63;}
			.el-checkbox__inner::after{}
			.el-checkbox__label{color: #4b4a63;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #4b4a63;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-bottom: 1px solid #989ba4;}
			input::-webkit-input-placeholder {}
			.el-button--primary{background: #4b4a63 !important;border: none;}	
		}
		.template10{
			.el-input-group__append, .el-input-group__prepend{background: rgba(#ffffff, 0.2);color: #999999;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: rgba(#fff, 0.2);border: none;}
			.el-checkbox__inner{border-radius: 50%;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{border-radius: 50%;background-color:#4b4a63;border-color: #4b4a63;}
			.el-checkbox__inner::after{}
			.el-checkbox__label{color: #4b4a63;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #4b4a63;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-bottom: 1px solid #989ba4;}
			input::-webkit-input-placeholder {}
			.el-button--primary{background: #4b4a63 !important;border: none;}	
		}
		.template11{
			input:-webkit-autofill{-webkit-box-shadow: 0 0 0px 1000px #f5f5f5 inset;}
			.el-input-group__append, .el-input-group__prepend{background: #f5f5f5;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: #f5f5f5;border: none;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-radius: 4px;background: #f5f5f5;}
			.el-button--primary{background: #2467e2 !important;border: none;}	
		}
		.template12{
			input:-webkit-autofill{-webkit-box-shadow: 0 0 0px 1000px #f5f5f5 inset;}
			.el-input-group__append, .el-input-group__prepend{background: #f5f5f5;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: #f5f5f5;border: none;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-radius: 4px;background: #f5f5f5;}
			.el-button--primary{background: #56a8fe !important;border: none;}	
		}
		.template13{
			input:-webkit-autofill{-webkit-box-shadow: 0 0 0px 1000px #f5f5f5 inset;}
			.el-input-group__append, .el-input-group__prepend{background: #f5f5f5;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: #f5f5f5;border: none;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-radius: 4px;background: #f5f5f5;}
			.el-button--primary{background: #56a8fe !important;border: none;}	
		}
		.template14{
			.el-input-group__append, .el-input-group__prepend{background: rgba(#ffffff, 0.2);border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: rgba(#fff, 0.2);border: none;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #989ba4;border-radius: 4px;}
			.el-button--primary{background-image: url('~@/assets/img/login_btn_15.png') !important;background-size: 100% 100% !important;background-color: transparent !important;border: none;}	
		}
		.template15{
			.el-input-group__append, .el-input-group__prepend{background: rgba(#ffffff, 0.2);color: #ffffff;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background: rgba(#fff, 0.2);color: #ffffff;border: none;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color: #ffffff;border-color: #ffffff;}
			.el-checkbox__inner::after{border-color:  #535768;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #ffffff;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #989ba4;border-radius: 4px;}
			input::-webkit-input-placeholder {color: #ffffff !important;}
			.el-button--primary{background-image: url('~@/assets/img/login_btn_15.png') !important;background-size: 100% 100% !important;background-color: transparent !important;border: none;}	
		}
		.template16{
			.el-input-group__append, .el-input-group__prepend{background-color: rgba(255, 255, 255, 0.8);color: #333333;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background-color: rgba(255, 255, 255, 0.8);color: #333333;border: none;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color: #f8f8fb;border-color: #f8f8fb;}
			.el-checkbox__inner::after{border-color:  #7d8baa;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: rgb(51, 51, 51);}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #ffffff;border-radius: 4px;}
			input::-webkit-input-placeholder {color: #595959 !important;}
			.el-button--primary{background-image: url('~@/assets/img/login_btn_16.png') !important;background-size: 100% 100% !important;background-color: transparent !important;border: none;}	
		}
		.template17{
			.el-input-group__append, .el-input-group__prepend{background-color: rgba(255, 255, 255, 0.8);color: #333333;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background-color: rgba(255, 255, 255, 0.8);color: #333333;border: none;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color: #f8f8fb;border-color: #f8f8fb;}
			.el-checkbox__inner::after{border-color:  #7d8baa;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: rgb(51, 51, 51);}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #ffffff;border-radius: 4px;}
			input::-webkit-input-placeholder {color: #595959 !important;}
			.el-button--primary{background-image: url('~@/assets/img/login_btn_17.png') !important;background-size: 100% 100% !important;background-color: transparent !important;border: none;}	
		}
		.template18{
			.el-input-group__append, .el-input-group__prepend{background-color: rgba(255, 255, 255, 0.8);color: #333333;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background-color: rgba(255, 255, 255, 0.8);color: #333333;border: none;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color: #f8f8fb;border-color: #f8f8fb;}
			.el-checkbox__inner::after{border-color:  #7d8baa;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: rgb(51, 51, 51);}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border: 1px solid #ffffff;border-radius: 4px;}
			input::-webkit-input-placeholder {color: #595959 !important;}
			.el-button--primary{background-image: url('~@/assets/img/login_btn_18.png') !important;background-size: 100% 100% !important;background-color: transparent !important;border: none;}	
		}
		.template19{
			.el-input-group__append, .el-input-group__prepend{background-color: rgba(255, 255, 255, 0.8);color: #6e6e6e;border: none;}
			.el-input.el-input-group.el-input-group--prepend input{background-color: rgba(255, 255, 255, 0.8);color: #6e6e6e;border: none;}
			.el-checkbox__inner{border-radius: 50%;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{border-radius: 50%;background-color: #4b4a63;border-color: #4b4a63;}
			.el-checkbox__inner::after{border-color:  #ffffff;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #4b4a63;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-bottom: 1px solid #989ba4;}
			input::-webkit-input-placeholder {color: #595959 !important;}
			.el-button--primary{background: #4b4a63 !important;border: none;}	
		}
		.template20{
			.footer{margin-top:80px;}
			.el-input-group__append, .el-input-group__prepend{background-color: transparent;color: #ffffff;border: none;padding: 0 !important;}
			.el-input.el-input-group.el-input-group--prepend input{background-color: transparent;color: #ffffff;border: none;}
			.el-checkbox__inner{border-radius: 50%;}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{border-radius: 50%;background-color: #ffffff;border-color: #ffffff;}
			.el-checkbox__inner::after{border-color:  #4b4a63;}
			.el-checkbox__input.is-checked+.el-checkbox__label{color: #ffffff;}
			.el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close{vertical-align: middle;border-bottom: 1px solid #989ba4;}
			input::-webkit-input-placeholder {color: #95a4c5 !important;}
			.el-button--primary{background: #ff92b1 !important;width: 200px !important;border: none;}	
		}
	}
</style>






