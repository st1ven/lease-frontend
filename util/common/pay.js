import {
  $request,
  unique,
  $UploadFile
} from '../../common/request.js'
import {
  encryptDes
} from '../../common/des.js';
//获取身份证号+姓名
const getIdentity = async (order_sn) => {
  // return new Promise((resolve, reject) => {
  //   $request({
  //     url: '/getidcard?order_sn=' + order_sn,
  //   }).then(res => {
  //     console.log(res, 'getidcardres')
  //     resolve(res.data)
  //   }).catch(err => {
  //     console.log(err, 'getidcarderr')
  //     reject(err)
  //   })
  // })
  console.log(order_sn, 'getIdentity')
  let opt = {
    url: '/getidcard?order_sn=' + order_sn,
  }
  let res = await $request(opt);
  return res.data;
}
// 获取密钥
const getPayKey = async () => {
  let opt = {
    url: '/idd/miyao',
  }
  let res = await $request(opt);
  return res.data;
}
// 获取支付宝支付参数
const getAliPay = async (order_sn, realname, idcard, miyao) => {
  let key = encryptDes(realname, miyao);
  let iv = encryptDes(idcard, miyao);
  let opt = {
    url: '/pay/shimingagain_pay',
    header: "application/x-www-form-urlencoded;charset=utf-8",
    // method: 'POST',
    data: {
      order_sn: order_sn,
      realnamee: key,
      idcardd: iv
    }
  }
  console.log(opt, 'opt')
  let res = await $request(opt);
  return res.data;
}
export default {
  getIdentity,
  getPayKey,
  getAliPay
}