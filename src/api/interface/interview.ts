// import InterviewListResp from

// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	// InterviewListResp: InterviewListResp
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
}
{
	// export interface SendReq {
	// 	phone: string;
	// }
	// export interface SendResp {
	// 	code: string;
	// 	message: string;
	// }
	// export interface Token {
	// 	access_token: string;
	// 	access_expire: bigint;
	// 	refresh_token: string;
	// 	refresh_expire: bigint;
	// }
	// export interface ResAuthButtons {
	// 	[propName: string]: any;
	// }
}
