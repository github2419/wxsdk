const app = getApp(); import MakeMd5 from '/md5.js'; var WXBizDataCrypt = require('/cryptojs/RdWXBizDataCrypt.js'); function makeSign(obj) { if (!obj) { console.log('需要加密的数组对象为空') } var str = ''; var secret = app.globalData.signSecret; if (!secret) { console.log('密钥未获取') } var arr = Object.keys(obj); arr.sort(); for (var i in arr) { str += arr[i] + "=" + obj[arr[i]] + "&" } var encrypted = MakeMd5.md5(str + "key=" + secret); return encrypted.toUpperCase() } function paramsHandel(params) { params.data.appid = app.globalData.appid; var timestamp = Date.now(); params.data.timestamp = timestamp.toString().substring(0, 10); var sign = makeSign(params.data); params.data.sign = sign; var newParamsData = []; if (params.method == "POST") { newParamsData['params'] = JSON.stringify(params.data); return newParamsData } return params.data } function urlHandel(params, url) { var url = app.globalData.apimain + url; if (params.method != "POST") { url += "?" + json2Form(params.data) } return url } function ContentType(ctype) { var ctypeinfo = { 'POST': "application/x-www-form-urlencoded", 'GET': "application/json" }; return ctypeinfo[ctype] } function json2Form(json) { var str = []; for (var p in json) { str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p])) } return str.join("&") } function wxRequest(params, url) { params.data = paramsHandel(params); wx.request({ url: urlHandel(params, url), data: params.data, header: { "Content-Type": ContentType(params.method) }, method: params.method || 'GET', success: (res) => { params.success && params.success(res) }, fail: (res) => { params.fail && params.fail(res) }, complete: (res) => { params.complete && params.complete(res) } }) } function getTerminalType() { let terminal_type = 'android_pad'; wx.getSystemInfo({ success: function (res) { var str = res.model; if (str.indexOf("iPhone") != -1) { terminal_type = 'iOS_phone' } if (str.indexOf("iPad") != -1) { terminal_type = 'iOS_pad' } if (str.indexOf("Android") != -1) { terminal_type = 'android' } return terminal_type } }); return terminal_type } function Trim(str) { return str.replace(/(^\s*)|(\s*$)/g, "") } function isOwnEmpty(obj) { for (var name in obj) { if (obj.hasOwnProperty(name)) { return false } } return true } function emptyFun(obj) { var obj = obj; if (obj == "" || obj == null || obj == undefined || obj == "null" || obj == "undefined") { return true } else { return false } } module.exports = { makeSign, wxRequest, getTerminalType, Trim, isOwnEmpty, emptyFun }