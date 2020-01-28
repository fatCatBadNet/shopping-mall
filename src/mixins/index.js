/**
 * Created by xieli on 2018/7/12 0012.
 */

const mixins = {
	methods: {
		prompt(msg) { //提示
			this.$message({
				message: msg,
				duration: 1000,
			});
		},
		notice(msg) {
			this.$message({
				message: msg,
				type: 'error',
				duration: 1000,
			});
		},
		success(msg) {
			this.$message({
				message: msg,
				type: 'success',
				duration: 1000,
			});
		},
		_handleFocus(){
			this.$nextTick(()=>{
						var a=  document.getElementsByClassName('el-icon-arrow-right');
						a[1].removeAttribute('disabled');
						a[1].classList.remove('is-disabled');
					})
		},
		_sendCode(params,func){
			return new Promise( (resolve,reject)=>{
				this.$prompt('请输入验证码', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValidator:(e)=>{
						if( e=='' || e==null ){
							return '验证码不能为空';
						}else{
							return true;
						}
					},
					beforeClose:(action,instance,done) => {
						if( action==='confirm' ){
							let newParams = Object.assign({},params,{VerifyCode:instance.inputValue});
							func(newParams).then(res=>{
								if( res.Ret==200 ){
									done();
									resolve(res);
								}
							})
						}else{
							done();
						}
					}
				}).then(({ value }) => {
					
				}).catch(() => {
					// this.$message({
					//   type: 'info',
					//   message: '取消输入'
					// });       
				});
			})
		}
		
	}
}

export { mixins }