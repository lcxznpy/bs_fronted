import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const jobRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "岗位"
		},
		children: [
			{
				path: "/job/listall",
				element: lazyLoad(React.lazy(() => import("@/views/job/listall/index"))),
				meta: {
					requiresAuth: true,
					title: "岗位列表",
					key: "job_list"
				}
			},
			{
				path: "/job/listuser",
				element: lazyLoad(React.lazy(() => import("@/views/job/listuser/index"))),
				meta: {
					requiresAuth: true,
					title: "我发布的岗位",
					key: "job_user_list"
				}
			},
			{
				path: "/job/create",
				element: lazyLoad(React.lazy(() => import("@/views/job/create/index"))),
				meta: {
					requiresAuth: true,
					title: "创建岗位",
					key: "create_job"
				}
			}
		]
	}
];

export default jobRouter;
