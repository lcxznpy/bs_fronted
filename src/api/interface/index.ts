// * 请求响应参数(不包含data)
// import { Register } from "@/api/interface/register";
// import { Interview } from "@/api/interface/interview";
// import ResLogin = Login.ResLogin;
// import ResRegister = Register.ResRegister;
// import InterviewListResp = Interview.InterviewListResp;

export interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	// ResLogin?: ResLogin;
	// ResRegister?: ResRegister;
	// InterviewListResp?: InterviewListResp;
	data?: T;
}

// * 分页响应参数
export interface ResPage<T> {
	datalist: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum: number;
	pageSize: number;
}

// * 登录
export namespace Login {
	export interface ReqLoginForm {
		name: string;
		password: string;
	}
	export interface ResLogin {
		UserId: number;
		Token: {
			access_token: string;
			access_expire: bigint;
			refresh_token: string;
			refresh_expire: bigint;
		};
	}
	// export interface Token {
	// 	access_token: string;
	// 	access_expire: bigint;
	// 	refresh_token: string;
	// 	refresh_expire: bigint;
	// }
	export interface ResAuthButtons {
		[propName: string]: any;
	}
}

export namespace Interview {
	// export interface InterviewListReq {}
	export interface InterviewListResp {
		rooms: Room[];
	}
	export interface Room {
		room_id: number;
		hr_id: number;
		user_id: number;
		desc: string;
		start_time: bigint;
		end_time: bigint;
	}
	export interface CreateInterViewReq {
		user_id: number;
		password: string;
		desc: string;
		start_time: number;
		end_time: number;
	}
	export interface CreateInterViewResp {
		room_id: number;
		success: boolean;
	}
}

export namespace Job {
	// export interface JobListReq {}
	export interface JobListResp {
		jobs: Job[];
	}
	export interface Job {
		job_id: number;
		user_id: number;
		desc: string;
		content: string;
		salary: string;
		address: string;
		company: string;
	}
	export interface CreateJobReq {
		desc: string;
		content: string;
		salary: string;
		address: string;
		company: string;
	}
	export interface CreateJobResp {
		job_id: number;
		success: boolean;
	}
}

export namespace Article {
	// export interface JobListReq {}
	export interface ArticleListResp {
		articles: Article[];
	}
	export interface Article {
		article_id: number;
		user_id: number;
		title: string;
		content: string;
	}
	export interface CreateArticleReq {
		title: string;
		content: string;
	}
	export interface CreateArticleResp {
		article_id: number;
		success: boolean;
	}
}

export namespace Upload {
	export interface UploadResp {
		url: string;
	}
}
