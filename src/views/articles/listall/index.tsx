import { useEffect, useState } from "react";
import { Table, DatePicker, message } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { ArticleListApi } from "@/api/modules/article";
import "./index.less";
import { useNavigate } from "react-router-dom";
// import { Interview } from "@/api/interface/interview";
// import { Interview } from "@/api/interface/interview";
// import { ResultData } from "@/api/interface/login";
// import {Result} from "@/api/interface/login";

const List = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	const { RangePicker } = DatePicker;
	const navigate = useNavigate();
	const [datasource, setdatasource] = useState<any>();

	useEffect(() => {
		// console.log(BUTTONS);s
	}, []);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await ArticleListApi();
				console.log(data === undefined);
				console.log(!data);
				if (data) {
					console.log("data", data);
					const articles = data?.articles;
					const qaq: any[] = articles;
					setdatasource(qaq);
				} else {
					console.log("data", data);
					throw new Error("获取数据列表失败");
				}
			} catch (error) {
				console.log(error);
				message.error("获取数据失败");
				navigate("/article");
			}
		};
		fetchData();
	}, []);

	const columns: any[] = [
		{
			title: "文章ID",
			dataIndex: "article_id",
			key: "article_id",
			align: "center"
		},
		{
			title: "创建者ID",
			dataIndex: "user_id",
			key: "user_id",
			align: "center"
		},
		{
			title: "文章题目",
			dataIndex: "title",
			key: "title",
			align: "center"
			// width: "50%"
		},
		{
			title: "内容",
			dataIndex: "content",
			key: "content",
			align: "center"
		}
	];
	return (
		<div className="card content-box">
			<div className="date">
				<span>切换国际化的时候看我 😎 ：</span>
				<RangePicker />
			</div>
			{/* <div className="auth">
				<Space>
					{BUTTONS.add && <Button type="primary">我是 Admin && User 能看到的按钮</Button>}
					{BUTTONS.delete && <Button type="primary">我是 Admin 能看到的按钮</Button>}
					{BUTTONS.edit && <Button type="primary">我是 User 能看到的按钮</Button>}
				</Space>
			</div> */}
			<Table bordered={true} dataSource={datasource} columns={columns} />
		</div>
	);
};

export default List;

// function formatToYYYYMMDDHHMM(timestamp: number) {
// 	const date = new Date(timestamp * 1000); // 将时间戳（秒）转换为毫秒
// 	const year = date.getUTCFullYear();
// 	const month = date.getUTCMonth() + 1; // getUTCMonth() 返回的是 0-11，需要加1
// 	const day = date.getUTCDate();
// 	const hour = date.getUTCHours();
// 	const minute = date.getUTCMinutes();
// 	return parseInt(
// 		`${year}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}${hour.toString().padStart(2, "0")}${minute
// 			.toString()
// 			.padStart(2, "0")}`
// 	);
// }
