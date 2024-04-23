import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const resumeRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "面经分享"
		},
		children: [
			{
				path: "/resume/upload",
				element: lazyLoad(React.lazy(() => import("@/views/resume/upload/index"))),
				meta: {
					requiresAuth: true,
					title: "upload",
					key: "upload"
				}
			}
		]
	}
];

export default resumeRouter;
