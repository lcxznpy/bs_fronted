import { Job } from "@/api/interface/index";
import { JobPort } from "@/api/config/servicePort";
// import qs from "qs";

import http from "@/api";

/**
 * @name 获取面试记录列表模块
 */
// * 获取面试记录列表接口
export const JobListApi = () => {
	return http.get<Job.JobListResp>(JobPort + `/alljob`);
	return http.get<Job.JobListResp>(JobPort + `/alljob`, {}); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	return http.get<Job.JobListResp>(JobPort + `/alljob`); // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	return http.get<Job.JobListResp>(JobPort + `/alljob`, { headers: { noLoading: true } }); // 控制当前请求不显示 loading
};

export const JobListUserApi = () => {
	return http.get<Job.JobListResp>(JobPort + `/userjob`);
	return http.get<Job.JobListResp>(JobPort + `/userjob`, {}); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	return http.get<Job.JobListResp>(JobPort + `/userjob`); // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	return http.get<Job.JobListResp>(JobPort + `/userjob`, { headers: { noLoading: true } }); // 控制当前请求不显示 loading
};

export const CreateJobApi = (params: Job.CreateJobReq) => {
	return http.post<Job.CreateJobResp>(JobPort + `/publish`, params, {
		headers: { "Content-Type": "application/json" }
	});
};
