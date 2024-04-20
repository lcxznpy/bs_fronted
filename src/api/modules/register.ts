import { Register } from "@/api/interface/register";
import { PORT1, SmsPort } from "@/api/config/servicePort";
import qs from "qs";

import http from "@/api";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const registerApi = (params: Register.ReqRegisterForm) => {
	return http.post<Register.ResRegister>(PORT1 + `/register`, params, { headers: { "Content-Type": "application/json" } });
	return http.post<Register.ResRegister>(PORT1 + `/register`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	return http.post<Register.ResRegister>(PORT1 + `/register`, qs.stringify(params)); // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	return http.post<Register.ResRegister>(PORT1 + `/register`, params, { headers: { noLoading: true } }); // 控制当前请求不显示 loading
};

// export const loginApi=(params:Login.ReqLoginForm) =>{
// 	return http.post<ResLogin>(PORT1+`/login’,params);
// }

export const sendCodeApi = (params: Register.SendReq) => {
	// console.log("params", params);
	return http.post<Register.SendResp>(SmsPort + `/sendSms`, params, { headers: { "Content-Type": "application/json" } });
	return http.post<Register.SendResp>(SmsPort + `/sendSms`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	return http.post<Register.SendResp>(SmsPort + `/sendSms`, qs.stringify(params)); // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	return http.post<Register.SendResp>(SmsPort + `/sendSms`, params, { headers: { noLoading: true } }); // 控制当前请求不显示 loading
};

// * 获取按钮权限
// export const getAuthorButtons = () => {
// 	return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
// };
//
// // * 获取菜单列表
// export const getMenuList = () => {
// 	return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
// };
