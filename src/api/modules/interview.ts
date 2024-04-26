import { Interview } from "@/api/interface/index";
import { InterviewPort } from "@/api/config/servicePort";
// import qs from "qs";

import http from "@/api";

/**
 * @name 获取面试记录列表模块
 */
// * 获取面试记录列表接口
export const InterviewListApi = () => {
	return http.get<Interview.InterviewListResp>(InterviewPort + `/roomlist`);
	return http.get<Interview.InterviewListResp>(InterviewPort + `/roomlist`, {}); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	return http.get<Interview.InterviewListResp>(InterviewPort + `/roomlist`); // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	return http.get<Interview.InterviewListResp>(InterviewPort + `/roomlist`, { headers: { noLoading: true } }); // 控制当前请求不显示 loading
};

export const CreateInterViewApi = (params: Interview.CreateInterViewReq) => {
	return http.post<Interview.CreateInterViewResp>(InterviewPort + `/create`, params, {
		headers: { "Content-Type": "application/json" }
	});
};


export const CheckApi = (params: Interview.CheckReq) => {
	return http.post<Interview.CheckResp>(InterviewPort + `/check`, params, {});
};

export const DeleteInterviewApi = (params: Interview.DeleteInterviewReq) => {
	return http.delete<Interview.DeleteInterviewResp>(InterviewPort + `/delete`, params, {
		headers: { "Content-Type": "application/json" }
	});
};
