import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const articleRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "面经分享"
		},
		children: [
			{
				path: "/article/listall",
				element: lazyLoad(React.lazy(() => import("@/views/articles/listall/index"))),
				meta: {
					requiresAuth: true,
					title: "岗位列表",
					key: "job_list"
				}
			},
			{
				path: "/article/userlist",
				element: lazyLoad(React.lazy(() => import("@/views/articles/listuser/index"))),
				meta: {
					requiresAuth: true,
					title: "我发布的岗位",
					key: "job_user_list"
				}
			},
			{
				path: "/article/create",
				element: lazyLoad(React.lazy(() => import("@/views/articles/create/index"))),
				meta: {
					requiresAuth: true,
					title: "创建岗位",
					key: "create_job"
				}
			}
		]
	}
];

export default articleRouter;
