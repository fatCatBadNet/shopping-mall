<template>
	<div style="position:relative;">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="公司">
		  		   		<el-select v-model.number="form.Company" clearable placeholder="请选择" style="width:170px;">
						    <el-option v-for="(item,index) in companylist" :key="index" :label="item.Name" :value="item.Name"></el-option>
						</el-select>
		  			</el-form-item>
		  			<el-form-item label="结算方式">
						<el-select v-model="form.SettMethod" clearable placeholder="请选择">
						    <el-option label="单条结算" value="单条结算"></el-option>
						    <el-option label="综合结算" value="综合结算"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="计价方式">
						<el-select v-model="form.ValuMethod" clearable placeholder="请选择">
						    <el-option label="CPA" value="CPA"></el-option>
						    <el-option label="CPA阶梯" value="CPA阶梯"></el-option>
						    <el-option label="CPS" value="CPS"></el-option>
						    <el-option label="CPS阶梯" value="CPS阶梯"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item label="价格">
		  		   		<el-input v-model="form.Price" placeholder="请输入" clearable></el-input>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="goAdd">添加</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border @expand-change="getcompanysourcelist">
					<el-table-column type="expand">
				      	<template slot-scope="scope">
							<el-row v-for="(item,index) in scope.row.listArr" :key="index" style="line-height:40px; color:#84909D;">
								<el-col :span="3" style="color:#000;">{{item.SourceName}}</el-col>
								<el-col :span="9" class="editwordSty">
									<el-tooltip effect="dark" content="点击复制链接" placement="top" style="vertical-align: middle;">
      									<span class="copyBtn" :data-clipboard-text="item.SourceLink" @click="$message.success('复制成功！')">{{item.SourceLink}}</span>
    								</el-tooltip>
								</el-col>
								<el-col :span="1">
									<el-tooltip placement="right" effect="light" style="border:none;">
										<div slot="content">
											<img :src="item.QRCode" style="height:150px; cursor:pointer;" />
										</div>
									  	<el-button style="padding:0; margin:0;">
									  		<img src="~@/assets/img/ewm.png" style="height:40px; cursor:pointer; margin:0px; padding:0;" />
									  	</el-button>
									</el-tooltip>
								</el-col>
								<el-col :span="3">
									<!-- <span class="editwordSty" @click="moreSize(item.SourceLink)">更多尺寸</span> -->
									<span v-if="item.Scheme==1" class="tags" style="background:#FF9800;">授信审核</span>
									<span v-else-if="item.Scheme==2" class="tags" style="background:#FD6700;">借款审核</span>
									<span v-else-if="item.Scheme==3" class="tags" style="background:#8A8A8A;">注册进黑名单</span>
									<span v-else style="display:block; width:100%; text-align:center;">&nbsp;</span>
								</el-col>
								<el-col :span="3">
									<el-switch v-model="item.State" :disabled="scope.row.Company=='官网'?true:false" active-text="" active-value="ON" inactive-text="" inactive-value="OFF" active-color="#5FB879" inactive-color="#ccc" @change="freezeSource(item.Id,item.State,item)"></el-switch>
									<span v-if="item.State=='ON'" style="color:#5FB879; margin-left:5px;">启用</span>
	  	    		        		<span v-else style="color:#ccc; margin-left:5px;">禁用</span>
								</el-col>
								<el-col :span="4">
									<el-button type="primary" plain size="mini" @click="goSave(scope.row,index,item.Id)">编辑渠道</el-button>
									<el-button type="primary" plain size="mini" @click="gochannelurl(item.SourceLinks)">渠道链接</el-button>
								</el-col>
							</el-row>
				      	</template>
				    </el-table-column>
					<el-table-column prop="Id" label="ID"></el-table-column>
					<el-table-column prop="Company" label="公司"></el-table-column>
					<el-table-column prop="BalanceType" label="结算方式"></el-table-column>
					<el-table-column prop="BalanceWay" label="计价方式"></el-table-column>
					<el-table-column prop="BalancePrice" label="价格"></el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
	  	    		        <el-switch v-model="scope.row.State" :disabled="scope.row.Company=='官网'?true:false" active-text="" active-value="ON" inactive-text="" inactive-value="OFF" active-color="#13ce66" inactive-color="#ff4949" @change="freezeDtl(scope.row.Id,scope.row.State)"></el-switch>
	  	    		        <span v-if="scope.row.State=='ON'" style="color:#13ce66; margin-left:5px;">启用</span>
	  	    		        <span v-else style="color:#ff4949; margin-left:5px;">禁用</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作" min-width="120px">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="goEdit(scope.row.Id)">编辑</el-button>
	  	    		        <el-button type="primary" plain size="mini" @click="goSave(scope.row,0,0)">新增渠道</el-button>
	  	    		        <el-button type="primary" plain size="mini" @click="goCompanyurl(scope.row.CompanyLinks)">公司链接</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
				<el-col :span="24" class="toolbar">
			  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			  	</el-col>
			</template>
		</el-card>
		<!-- 添加/编辑弹框 -->
		<el-dialog title="添加/编辑渠道公司" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="740px">
			<el-form :model="infoForm" label-width="100px" ref="infoForm">
				<el-form-item label="公司名称" prop="Company" :rules="[{required:true,message:'请输入公司名称'}]">
					<el-input v-model="infoForm.Company" placeholder="请输入名称" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<el-form-item label="结算方式" prop="BalanceType" :rules="[{required:true,message:'请选择结算方式'}]">
					<el-select v-model.number="infoForm.BalanceType" clearable placeholder="请选择" style="width:50%;">
					    <el-option label="单条结算" :value="'单条结算'"></el-option>
					    <el-option label="综合结算" :value="'综合结算'"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="计费方式" prop="BalanceWay" :rules="[{required:true,message:'请选择计费方式'}]">
					<el-select v-model.number="infoForm.BalanceWay" clearable placeholder="请选择" style="width:50%;" @change="changeWay">
					    <el-option label="CPA" :value="'CPA'"></el-option>
					    <el-option label="CPA阶梯" :value="'CPA阶梯'"></el-option>
					    <el-option label="CPS" :value="'CPS'"></el-option>
					    <el-option label="CPS阶梯" :value="'CPS阶梯'"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="waytype" label="单价(元)" prop="BalancePrice" :rules="[{required:true,message:'单价不得为空'}]">
					<el-input v-model.number="infoForm.BalancePrice" placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<div v-else>
					<el-form-item v-for="(item,index) in infoForm.Steps" :key="index" :label="index+1+'级'">
						<el-input v-model.number="item.StartPoint" placeholder="输入整数（包含）" auto-complete="off" disabled style="width:30%;"></el-input>
						<span> - </span>
						<el-input v-model.number="item.EndPoint" placeholder="输入整数（不包含）" auto-complete="off" :disabled="index<infoForm.Steps.length-1?false:true" @change="changePoint(index)" style="width:30%;"></el-input>
						<span>&nbsp;</span>
						<el-input v-model.number="item.SinglePrice" placeholder="请输入单价（元）" auto-complete="off" style="width:30%;"></el-input>
					</el-form-item>
					<el-form-item>
						<span class="editwordSty" @click="delSteps"> - 删除级数</span>&nbsp;&nbsp;
						<span class="editwordSty" @click="addSteps"> + 添加级数</span>
					</el-form-item>
				</div>
				<el-form-item label="渠道状态：" prop="State">
					<el-switch v-model="infoForm.State" :disabled="infoForm.Company=='官网'?true:false" active-text="启用" active-value="ON" inactive-text="停用" inactive-value="OFF"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="infoSubmit">提交</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 新增/编辑渠道弹框 -->
		<el-dialog title="新增/编辑渠道" :visible.sync="addDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="800px">
			<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm">
				<el-form-item label="公司名称" prop="CompanyId">
					<el-select v-model="addForm.CompanyId" placeholder="请选择" disabled style="width:50%;">
						<el-option :label="addForm.Company" :value="addForm.CompanyId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="渠道名称" prop="SourceName">
					<el-input v-model="addForm.SourceName" placeholder="请输入英文字母" clearable :disabled="addForm.Company=='官网'" auto-complete="off" @change="inputSource" style="width:50%;"></el-input>
					<span style="margin-left:20px; color:#999;"> * {{addForm.Company=='官网'?'官网渠道名称不可编辑':'仅限英文字母、拼音或数字'}}</span>
				</el-form-item>
				<el-form-item label="" prop="SourceLink">
					<el-input v-model="copyurl+addForm.SourceName" disabled auto-complete="off" style="width:80%;"></el-input>
					<span class="copyBtn" :data-clipboard-text="addForm.SourceLink" @click="copyUrl" style="color:#3A94F8; cursor:pointer; margin-left:20px;">复制</span>
				</el-form-item>
				<el-form-item label="扣量比例">
					<el-input v-model.number="addForm.CutScale" placeholder="请输入整数" clearable auto-complete="off" style="width:50%;">
						<template slot="append">%</template>
					</el-input>
					<span style="margin-left:20px; color:#999;"> * 扣除数量的百分比</span>
				</el-form-item>
				<el-form-item label="扣量保护值">
					<el-input v-model.number="addForm.CutProtected" placeholder="请输入具体数量" clearable auto-complete="off" style="width:50%;"></el-input>
					<span style="margin-left:20px; color:#999;"> * 渠道量高于该保护值时开始扣量</span>
				</el-form-item>
				<el-form-item label="风控策略" prop="Scheme">
					<el-select v-model="addForm.Scheme" placeholder="请选择" style="width:50%;">
						<el-option label="常规风控流程" :value="0"></el-option>
						<el-option label="人工审核" :value="2"></el-option>
						<el-option label="注册进黑名单" :value="3"></el-option>
					</el-select>
					<el-popover placement="right" title="" width="360" trigger="hover">
						<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">&nbsp;1. 常规风控流程：即按照现有风控流程处理；</p>
						<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">&nbsp;2. 人工审核：凡该渠道进来用户，借款申请后需人工在「风控」-「借款管理」中审核后放款；</p>
						<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">&nbsp;3. 注册进黑名单：凡该渠道进来用户，注册完成后直接进入黑名单；</p>
						<el-button icon="el-icon-info" circle slot="reference" style="border:none;"></el-button>
  					</el-popover>
				</el-form-item>
				<el-form-item label="渠道状态" prop="State">
					<el-switch v-model="addForm.State" :disabled="addForm.Company=='官网'?true:false" active-text="启用" active-value="ON" inactive-text="停用" inactive-value="OFF"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addSubmit">保存</el-button>
				<el-button @click.native="addDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 下载二维码弹框 -->
		<el-dialog title="尺寸大小" :visible.sync="downloadDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="280px">
			<div style="font:16px/40px '微软雅黑';">
				<span>180*180px</span>
				<i class="el-icon-download" @click="downImg(180)" style="float:right; font-size:20px; cursor:pointer; margin-top:10px;"></i>
			</div>
			<div style="font:16px/40px '微软雅黑';">
				<span>360*360px</span>
				<i class="el-icon-download" @click="downImg(360)" style="float:right; font-size:20px; cursor:pointer; margin-top:10px;"></i>
			</div>
			<div style="font:16px/40px '微软雅黑';">
				<span>480*480px</span>
				<i class="el-icon-download" @click="downImg(480)" style="float:right; font-size:20px; cursor:pointer; margin-top:10px;"></i>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="downloadDialog=false">关闭</el-button>
			</div>
		</el-dialog>
		<p @click="guideDialog=true" class="guide">新手指引</p>
		<!--新手指引弹框 -->
		<el-dialog title="" :visible.sync="guideDialog" :show-close="false" :close-on-click-modal="true" :center="true" custom-class="zdyDialog" width="600px">
			<img src="~@/assets/img/guide.png" style="display:block; height:50px; margin:0 auto;" />
			<p style="font:18px/50px '微软雅黑'; color:#101010; text-align:center;">新手指引</p>
			<div style="font:14px/26px '微软雅黑'; color:#5E5E5E;">
				<p>给渠道方提供推广链接，需完成以下2个步骤：</p>
			    <p style="text-indent:1em; margin-top:10px;">1. 添加渠道方公司（列表右上角「添加」按钮）;</p>
			    <p style="text-indent:1em; margin-bottom:15px;">2. 新增渠道（添加的公司后「新增渠道」按钮）;</p>
			    <p>完成以上操作后，即可将推广链接发给渠道方，可在【运营】-【渠道配置】中分享公司链接及渠道链接。公司链接可查看推广渠道公司的全部渠道数据，渠道链接仅可查看当前渠道的数据。</p>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="guideDialog=false" style="padding:10px 38px;">知道了</el-button>
			</div>
			<br />
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { companyselect,chansetlist,chansetupdatestate,chansetinfo,chansetaddedit,sourceadd,companysourcelist,sourcestateupdate,qrcode } from 'api/api.js';
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');
export default {
	data(){
		return {
			companylist:[],
			page:1,
			total:0,
			pageSize:15,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ 
				Company:'',
				SettMethod:'',
				ValuMethod:'',
				Price:''
			},
			showDialog:false,  //添加/编辑渠道公司
			waytype:true,
			copyurl:sessionStorage.getItem('copyurl')+'extend/index?merchant='+JSON.parse(sessionStorage.getItem('userDtl')).Merchant+'&source=',
			infoForm:{
				Id:null,
				Company:"",  //公司名称
				BalancePrice:null,  //结算单价
				BalanceType:"",  //结算类型:单条结算、综合结算
				BalanceWay:"",  //结算-计算方式:CPA、CPS、CPA+表示A阶梯结算、CPS+表示S阶梯结算
				SourceSteps:null,  //级数
				Steps:[
					{StartPoint:0,EndPoint:null,SinglePrice:null},
					{StartPoint:null,EndPoint:null,SinglePrice:null}
				],
				State:'ON'   //渠道状态：ON-启用 OFF-停用
			},
			addDialog:false,  //添加、编辑渠道弹窗
			addForm:{
				"Company": "",
				"CompanyId":null,
				"CutScale":null,
				"CutProtected":null,
				"SourceId": 0,
				"SourceLink": "",
				"SourceName": "",
				"Scheme":0,
				"State":"ON"
			},
			rules:{
				CompanyId:[{
					required:true,
					message:'请选择公司名称',
					trigger:'blur'
				}],
				SourceName:[{
					required:true,
					message:'渠道名称不得为空',
					trigger:'blur'
				}],
				SourceLink:[{
					required:true,
					message:'请输入渠道名称',
					trigger:'blur'
				}],
				Scheme:[{
					required:true,
					message:'请选择风控策略',
					trigger:'blur'
				}]
			},
			downloadDialog:false,  //尺寸下载弹窗
			downSourceLink:'',  //要生成二维码的链接  
			guideDialog:false  //新手指引弹窗
		}
	},
	mounted(){
		companyselect({}).then((res) => {
			if( res.Ret==200 ){
				this.companylist=res.List || [];
			}
		});
		this.getlist();
	},
	methods: {
		moreSize(link){  //更多尺寸
			this.downSourceLink=link;
			this.downloadDialog=true;
		},
		downImg(size){
			if( !this.downSourceLink ){
				this.$message.error("参数有误,不可下载！");
				return false;
			}
			console.log( escape(this.downSourceLink) );
			window.location.href=process.env.API_ROOT+"/down/qrcode?source_link="+escape(this.downSourceLink)+"&width="+size+"&height="+size+"&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant;
		},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getlist();
				this.ispage = true;
			});
		},
		getlist(){  //获取列表
			let that=this;
			let params = {
				Page:this.page,
				PageSize:this.pageSize,
				Company:this.form.Company,
				SettMethod:this.form.SettMethod,
				ValuMethod:this.form.ValuMethod,
				Price:this.form.Price
			};
			this.listLoading = true;
			chansetlist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.Sum;
				if(res.Result.List == null){
					this.tableData = [];
				}else{
					that.tableData=[];
					res.Result.List.forEach(item=>{
						item.listArr=that.getsourcelist(item.Id);
						that.tableData.push( item );
					});
				}
				this.listLoading = false;
			});
		},
		getsourcelist(id){  //列表遍历获取公司渠道信息
			companysourcelist({CompanyId:id}).then((res) => {
				if( res.Ret==200 ){
					return res.List || [];
				}
			});	
		},
		getcompanysourcelist(row,expandedRows){   //展开获取公司渠道列表
			if( expandedRows.length>0 ){
				companysourcelist({CompanyId:row.Id}).then((res) => {
					if( res.Ret==200 ){
						row.listArr=res.List || [];
					}
				});	
			}
		},
		goSave(item,index,id){  //新增渠道
			console.log(item);
			if( this.copyurl.indexOf('http')==-1 ){
				this.copyurl=sessionStorage.getItem('copyurl')+'extend/index?merchant='+JSON.parse(sessionStorage.getItem('userDtl')).Merchant+'&source=';
			}
			this.addForm.Company=item.Company;
			this.addForm.CompanyId=item.Id;
			this.addForm.SourceId=id;
			if( id==0 ){
				this.addForm.SourceLink="";
				this.addForm.SourceName="";
				this.addForm.Scheme=0;
				this.addForm.State="ON";
			}else{
				this.addForm.SourceLink=item.listArr[index].SourceLink;
				this.addForm.SourceName=item.listArr[index].SourceName;
				this.addForm.Scheme=item.listArr[index].Scheme;
				this.addForm.CutScale=item.listArr[index].CutScale;
				this.addForm.CutProtected=item.listArr[index].CutProtected;
				this.addForm.State=item.listArr[index].State;
			}
			this.addDialog=true;
		},
		freezeSource(id,state,item){  //产品禁用、启用
			let params = {SourceId:id,State:state};
			sourcestateupdate(params).then((res) => {
				if( res.Ret == 200 ){
					this.$message.success( res.Msg );
					item.ischange=true;
				}
			});
		},
		inputSource(){
			this.addForm.SourceLink=this.copyurl+this.addForm.SourceName;
		},
		copyUrl(){  //复制到粘贴板
			if( !this.addForm.SourceName ){
				this.$message.error('请先输入渠道名称！');
				return false;
			}
			if( !(/^[A-Za-z0-9]+$/.test(this.addForm.SourceName)) && this.addForm.SourceName !='官网'  && this.addForm.SourceName !='官网Android' && this.addForm.SourceName !='官网iOS'){   //特例
				this.$message.error("渠道名称仅限英文字母、拼音或数字！");
				return false;
			}
			this.$message.success('复制成功！');
		},
		addSubmit(){
			this.$refs.addForm.validate((valid) => {
				if( valid ){
					if( !(/^[A-Za-z0-9]+$/.test(this.addForm.SourceName)) && this.addForm.SourceName !='官网'  && this.addForm.SourceName !='官网Android' && this.addForm.SourceName !='官网iOS'){ //特例
						this.$message.error("渠道名称仅限英文字母、拼音或数字！");
						return false;
					}
					if( this.addForm.CutScale%1!=0 || this.addForm.CutScale<0 || this.addForm.CutScale>100 ){
						this.$message.error( "扣量比例：请输入正确的数值!" );
						return false;
					}
					if( this.addForm.CutProtected%1!=0 || this.addForm.CutProtected<0 ){
						this.$message.error( "扣量保护值：请输入正确的数值!" );
						return false;
					}
					let params=this.addForm;
					sourceadd(params).then((res) => {
						if( res.Ret==200 ){
							this.resetForm('addForm');
							this.addDialog=false;
							this.getlist();
							this.$message.success( res.Msg );
						}
					});	
				}
			});
		},
		goAdd(){
			this.infoForm={
				Id:null,
				Company:"",  
				BalancePrice:null,  
				BalanceType:"",  
				BalanceWay:"", 
				SourceSteps:null, 
				Steps:[
					{StartPoint:0,EndPoint:null,SinglePrice:null},
					{StartPoint:null,EndPoint:null,SinglePrice:null}
				],
				State:'ON' 
			}
			this.showDialog=true;
		},
		goEdit(id){  //编辑
			let params={Id:id};
			chansetinfo(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.infoForm=res.Result;
				if( this.infoForm.BalanceWay=="CPA阶梯" || this.infoForm.BalanceWay=="CPS阶梯" ){
					this.waytype=false;
				}else{
					this.waytype=true;
				}
				if( this.infoForm.Steps==null ){
					this.infoForm.Steps=[
						{StartPoint:0,EndPoint:null,SinglePrice:null},
						{StartPoint:null,EndPoint:null,SinglePrice:null}
					]
				}else{
					this.infoForm.Steps[this.infoForm.Steps.length-1].EndPoint=null;
				}
//				console.log( this.infoForm,this.waytype );
				this.showDialog=true;
			});
		},
		changeWay(){  //计算方式change
			if( this.infoForm.BalanceWay=="CPA" || this.infoForm.BalanceWay=="CPS" ){
				this.waytype=true;
			}else{
				this.waytype=false;
			}
			console.log( this.waytype );
		},
		addSteps(){  //添加级数
			if( !this.infoForm.Steps[this.infoForm.Steps.length-2].EndPoint ){
				this.$message.error( '请先完善数据' );
				return false;
			}
			if( !this.infoForm.Steps[this.infoForm.Steps.length-2].SinglePrice ){
				this.$message.error( '请先完善数据' );
				return false;
			}
			this.infoForm.Steps.push({StartPoint:null,EndPoint:null,SinglePrice:null});
			this.infoForm.Steps[this.infoForm.Steps.length-1].StartPoint=this.infoForm.Steps[this.infoForm.Steps.length-2].EndPoint+1;
		},
		delSteps(){
			if( this.infoForm.Steps.length>2 ){
				this.infoForm.Steps.pop();
				this.infoForm.Steps[this.infoForm.Steps.length-1].EndPoint=null;
			}else{
				this.$message.error("阶级最少2条！");
			}
		},
		changePoint(index){  //级数终止点输入
			if( this.infoForm.Steps[index].EndPoint<=this.infoForm.Steps[index].StartPoint ){
				this.infoForm.Steps[index].EndPoint=null;
				this.$message.error( "不得小于当前级数的起始值！" );
				return false;
			}
			if( this.infoForm.Steps[index].EndPoint%1!=0 ){
				this.infoForm.Steps[index].EndPoint=null;
				this.$message.error( "请输入整数！" );
				return false;
			}
			this.infoForm.Steps[index+1].StartPoint=this.infoForm.Steps[index].EndPoint+1;
		},
		infoSubmit(){
			console.log( this.infoForm,this.waytype );
			if( !this.infoForm.Company || !this.infoForm.BalanceType || !this.infoForm.BalanceWay ){
				this.$message.error( '请先完善数据' );
				return false;
			}
			if( !this.waytype && (!this.infoForm.Steps[this.infoForm.Steps.length-2].EndPoint || !this.infoForm.Steps[this.infoForm.Steps.length-2].SinglePrice || !this.infoForm.Steps[this.infoForm.Steps.length-1].SinglePrice) ){
				this.$message.error( '请先完善数据' );
				return false;
			}
			if( this.waytype && !this.infoForm.BalancePrice ){
				this.$message.error( '请输入结算单价' );
				return false;
			}
			if( this.waytype ){  //非阶梯
				this.infoForm.Steps=[];
				this.infoForm.SourceSteps=null;
			}
			if( !this.waytype ){  //阶梯
				this.infoForm.BalancePrice=null;
				this.infoForm.SourceSteps=this.infoForm.Steps.length;
			}
			let params=this.infoForm;
			chansetaddedit(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.getlist();
				this.resetForm('infoForm');
				this.showDialog=false;
				this.waytype=true;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getlist();
	   	},
	   	freezeDtl(id,state){  //产品禁用、启用
			let params = {Id:id,State:state}
			chansetupdatestate(params).then((res) => {
				if( res.Ret == 200 ){
					this.$message.success( res.Msg );
					this.getlist();
				}
			});
		},
		goCompanyurl(link){  //公司甲方链接
			window.open(link,'_blank');
		},
		gochannelurl(link){  //渠道链接
			window.open(link,'_blank');
		},
		resetForm(formName){  //重置表单
      		this.$nextTick(() => {
		        this.$refs[formName].resetFields();
		    });
      	}
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.tags{ display:inline-block; height:24px; font:12px/24px "微软雅黑"; padding:0px 5px; background:#FF9800; color:#fff; border-radius:4px; margin-left:20px; }
	.guide{ width:28px; padding:5px 8px; box-sizing:border-box; color:#fff; background:#FF7100; border-radius:2px; font:12px '微软雅黑'; cursor:pointer; box-shadow:0 0 10px #666; position:fixed; top:200px; right:15px; z-index:10; }
</style>