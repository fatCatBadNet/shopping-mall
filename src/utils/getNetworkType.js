export default function () {
    var ua = navigator.userAgent;
    var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
    networkStr = networkStr.toLowerCase().replace('nettype/', '');
    var networkType;
    switch (networkStr) {
        case 'wifi':
            networkType = 'wifi';
            break;
        case '4g':
            networkType = '4g';
            break;
        case '3g':
            networkType = '3g';
            break;
        case '3gnet':
            networkType = '3g';
            break;
        case '2g':
            networkType = '2g';
            break;
        default:
            networkType = '未知';
    }
    return networkType;
}
