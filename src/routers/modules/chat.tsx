import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const articleRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "聊天"
		},
		children: [
			{
				path: "/talk/list",
				element: lazyLoad(React.lazy(() => import("@/views/talk/list/index"))),
				meta: {
					requiresAuth: true,
					title: "聊天",
					key: "chat"
				}
			}
		]
	}
];

export default articleRouter;
