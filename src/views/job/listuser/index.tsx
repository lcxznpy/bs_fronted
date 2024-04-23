import { useEffect, useState } from "react";
import { Table, DatePicker, message } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { JobListUserApi } from "@/api/modules/job";
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
		// console.log(BUTTONS);
	}, []);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await JobListUserApi();
				console.log(data === undefined);
				console.log(!data);
				if (data) {
					console.log("data", data);
					// console.log("result", result?.InterviewListResp?.rooms);
					const jobs = data?.jobs;
					// console.log("rooms", rooms);
					const qaq: any[] = jobs;
					// const formattedDates = qaq.map(item => ({
					// 	...item, // 复制对象的所有现有字段
					// 	start_time: formatToYYYYMMDDHHMM(item.start_time), // 转换时间戳字段
					// 	end_time: formatToYYYYMMDDHHMM(item.end_time)
					// }));
					setdatasource(qaq);
				} else {
					console.log("data", data);
					throw new Error("获取数据列表失败");
				}
			} catch (error) {
				console.log(error);
				message.error("获取数据失败");
				navigate("/job");
			}
		};
		fetchData();
	}, []);

	const columns: any[] = [
		{
			title: "岗位ID",
			dataIndex: "job_id",
			key: "job_id",
			align: "center"
		},
		{
			title: "创建者ID",
			dataIndex: "user_id",
			key: "user_id",
			align: "center"
		},
		{
			title: "岗位描述",
			dataIndex: "desc",
			key: "desc",
			align: "center"
			// width: "50%"
		},
		{
			title: "岗位要求",
			dataIndex: "content",
			key: "content",
			align: "center"
		},
		{
			title: "薪资",
			dataIndex: "salary",
			key: "salary",
			align: "center"
		},
		{
			title: "地址",
			dataIndex: "address",
			key: "address",
			align: "center"
		},
		{
			title: "公司",
			dataIndex: "company",
			key: "company",
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
