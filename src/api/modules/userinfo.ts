import { User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const UserInfoApi = () => {
	return http.get<User.UserInfoResp>(PORT1 + `/info`);
};
