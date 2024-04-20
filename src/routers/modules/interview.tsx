import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const interviewRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "面试预约"
		},
		children: [
			{
				path: "/interview/list",
				element: lazyLoad(React.lazy(() => import("@/views/interview/list/index"))),
				meta: {
					requiresAuth: true,
					title: "面试预约记录表",
					key: "interview_list"
				}
			},
			{
				path: "/interview/createroom",
				element: lazyLoad(React.lazy(() => import("@/views/interview/create/index"))),
				meta: {
					requiresAuth: true,
					title: "创建面试房间",
					key: "create_room"
				}
			},
			{
				path: "/interview/enterroom",
				element: lazyLoad(React.lazy(() => import("@/views/interview/enter/index"))),
				meta: {
					requiresAuth: true,
					title: "面试房间",
					key: "room"
				}
			}
		]
	}
];

export default interviewRouter;
