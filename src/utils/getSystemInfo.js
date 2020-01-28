function isPc() {
    let app = navigator.appVersion;
    let List = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    for (let item of List) {
        // console.log(app.includes(item));
        if (app.includes(item)) {
            return false;
        }
    }
    return true;
}

export default function () {
    if( isPc() ){
        return 'pc';
    }else{
        let app = navigator.appVersion;
        let left = app.indexOf('(');
        let right = app.indexOf(')');
        let str = app.substring(left + 1, right);
        // console.log(str+'裁剪过后的');
        let Str = str.split(";");
        // 手机型号--苹果 iPhone
        let Mobile_Iphone = Str[0];
        // 手机型号--安卓 
        let Mobile_Android = Str[2];
        // 红米手机等特殊型号处理 匹配字符
        let res = /Android/;
        let reslut = res.test(Mobile_Android);
        if( Str[0]=='iPhone' ){
            return Mobile_Iphone + ',' + Str[1].substring(4, 19);
		}else if( Str[0]=='Linux' ){
			if( reslut ){
				return Str[4].substring(0, 9) + ',' + Str[2];
			}else{
				return Mobile_Android.substring(0, 9) + ',' + Str[1];
			}
		}else if( Str[0]=='iPad' ){
			return Str[0] + ',' + Str[1].substring(4, 12);
		}
	}
}