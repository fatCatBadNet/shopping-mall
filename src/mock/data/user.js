import Mock from 'mockjs';
const LoginUsers = [
  {
    id:1,
    username:'admin',
    password:'123456',
//  avatar:'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
		avatar:'http://wx.qlogo.cn/mmhead/DmTSLTdleevQ5vic6A8pzHkOCibNuE4dzVhx83ZPp7iac6yPAcSfyGI2Q/132',
    name:'zmx'
  }
];

const Users = [];
for (let i = 0; i < 286; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

export { LoginUsers, Users };