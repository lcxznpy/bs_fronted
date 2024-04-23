import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const userRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "用户"
		},
		children: [
			{
				path: "/user/info",
				element: lazyLoad(React.lazy(() => import("@/views/user/info/index"))),
				meta: {
					requiresAuth: true,
					title: "岗位列表",
					key: "job_list"
				}
			}
		]
	}
];

export default userRouter;
