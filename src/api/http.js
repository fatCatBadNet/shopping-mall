'use strict'
import axios from 'axios'
import bus from './bus.js'

axios.interceptors.request.use(config => {  // 请求拦截
	return config;
},error => {
	return Promise.reject(error);
});

axios.interceptors.response.use(response => {  //响应拦截
	return response;
},error => {
   	return Promise.resolve(error.response);
});

function postData(val,url){  //处理请求数据
	if( url=="/conf/loginconf" || url=="/sysuser/login" || url=="/valid/regist" || url=="/valid/verify" || url=="/valid/authconf" || url=="/conf/mainauth" ){
//		return b.encode(JSON.stringify(val));
		return JSON.stringify(val);
	}else{
		var userDtl = sessionStorage.userDtl || '';
		userDtl = JSON.parse( userDtl );
		var usertoken = sessionStorage.Token || '';
		var Xtn = sessionStorage.Xtn || '';
		if( userDtl.Account && userDtl.Merchant && usertoken ){
			val.Account = userDtl.Account;
			val.Merchant = userDtl.Merchant;
			val.Token = usertoken;
			val.Xtn=Xtn;
//			return b.encode(JSON.stringify(val));
			return JSON.stringify(val);
		}else{
//			window.location.href = process.env.login;
			sessionStorage.clear();
			setTimeout(function(){
				window.location.reload();
			},2000);
		}
	}
}

function h5postData(val){
	return JSON.stringify(val);
}

function getData(val,url){  //处理请求数据
	var userDtl = sessionStorage.userDtl || '';
	userDtl = JSON.parse( userDtl );
	var usertoken = sessionStorage.Token || '';
	if( userDtl.Account && userDtl.Merchant && usertoken ){
		val.Account = userDtl.Account;
		val.Merchant = userDtl.Merchant;
		val.Token = usertoken;
	}else{
//		window.location.href = process.env.login;
		sessionStorage.clear();
		setTimeout(function(){
			window.location.reload();
		},2000);
	}
}

function checkStatus(response){  //处理响应数据(传统非h5)
	if( response && ( response.status === 200 ) ){  // loading,如果http状态码正常，则直接返回数据
//		let res = JSON.parse(b.decode(response.data));
		let res = response.data;
		if( !res ){
			bus.$message.error( "服务器开了个小差" );
			return false;
		}
		if( res.Ret!=200 && res.Ret!=100 ){
			bus.$message.error( res.Msg );
		}
		if( res.Ret==408 ){
//			window.location.href=process.env.login;
			sessionStorage.clear();
			setTimeout(function(){
				window.location.reload();
			},2000);
			return false;
		}
		return res;
	}else{
		bus.$message.error( "网络异常" );
		return false;
	}
}

function h5checkStatus(response){  //处理响应数据(h5)
	if( response && ( response.status === 200 ) ){  // loading,如果http状态码正常，则直接返回数据
		let res = response.data;
		if( !res ){
			bus.$message.error( "服务器开了个小差" );
			return false;
		}
		if( res.Ret!=200 ){
			bus.$message.error( res.Msg );
		}
		if( res.Ret==408 ){
//			window.location.href=process.env.login;
			sessionStorage.clear();
			setTimeout(function(){
				window.location.reload();
			},2000);
			return false;
		}
		return res;
	}else{
		bus.$message.error( "网络异常" );
		return false;
	}
}

function checkCode(res){
	bus.$message.error( "网络异常" );
}

export default{
	post(url,data){  //post请求方式
    	return axios({
      		method:'post',
			url:url,
			baseURL:process.env.API_ROOT,
      		data:postData(data,url),
      		timeout:30000,
            headers:{ 'Content-Type':'application/json; charset=utf-8' }
	    }).then(
	    	(response) => { return checkStatus(response); }
	    ).catch(
	      	(res) => { return checkCode(res); }
	    )
	},
	h5post(url,data){  //post请求方式
    	return axios({
      		method:'post',
			url:url,
			baseURL:process.env.H5_ROOT,
      		data:h5postData(data),
      		timeout:10000,
            headers:{ 'Content-Type':'application/json; charset=utf-8' }
	    }).then(
	    	(response) => { return h5checkStatus(response); }
	    ).catch(
	      	(res) => { return checkCode(res); }
	    )
	},
	get(url,data){  //get请求方式
    	return axios({
	      	method:'get',
	      	baseURL:process.env.API_ROOT,
	      	url:url,
	      	params:getData(data,url),
	      	timeout:10000
	    }).then(
	    	(response) => { return checkStatus(response); }
	    ).catch(
	    	(res) => { return checkCode(res); }
	    )
	},
	Base64,
	dateFormatter,
	parserDate,
	generaMenu
}

function generaMenu(data,remarkArr){  //菜单按钮权限判断
	if( data ){
		data.forEach((item) => {
			if(item.children) {
				this.generaMenu(item.children,remarkArr);
			}
			remarkArr.push(item.remark);
		});
	}
	return remarkArr;
}
			
function Base64() {
    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    }
    // private method for UTF-8 encoding
    this._utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }
    // private method for UTF-8 decoding
    this._utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                var c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
var b = new Base64();
function dateFormatter(str) { //默认返回yyyy-MM-dd HH-mm-ss
	var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
	var d = new Date(str);
	var year = d.getFullYear();
	var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
	var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
	var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
	if(hasTime) {
		return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
	} else {
		return [year, month, day].join('-');
	}
}
function parserDate(date){
    var t = Date.parse(date);
    if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
    } else {
        return new Date();
    }
}