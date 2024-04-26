// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Table, DatePicker, message, Space, Button } from "antd";
import type { TableColumnsType } from "antd";
import { InterviewListApi, DeleteInterviewApi } from "@/api/modules/interview";
import "./index.less";
import { useNavigate } from "react-router-dom";

interface DataType {
	room_id: React.Key;
	hr_id: number;
	user_id: number;
	desc: string;
	start_time: string;
	end_time: string;
}

const List = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	const { RangePicker } = DatePicker;
	const navigate = useNavigate();
	const [datasource, setdatasource] = useState<DataType[]>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const datalist: DataType[] = [];
	useEffect(() => {
		// console.log(BUTTONS);
	}, []);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await InterviewListApi();
				console.log(data === undefined);
				console.log(!data);
				if (data) {
					console.log("data", data);
					// console.log("result", result?.InterviewListResp?.rooms);
					const rooms = data?.rooms;
					// console.log("rooms", rooms);
					const formattedDates = rooms.map(item => ({
						...item, // 复制对象的所有现有字段
						start_time: formatToYYYYMMDDHHMM(item.start_time), // 转换时间戳字段
						end_time: formatToYYYYMMDDHHMM(item.end_time)
					}));
					formattedDates.forEach(element => {
						datalist.push({
							room_id: element.room_id,
							hr_id: element.hr_id,
							user_id: element.user_id,
							desc: element.desc,
							start_time: element.start_time,
							end_time: element.end_time
						});
					});
					setdatasource(datalist);
				} else {
					console.log("data", data);
					throw new Error("获取数据列表失败");
				}
			} catch (error) {
				console.log(error);
				message.error("获取数据失败");
				navigate("/interview");
			}
		};
		fetchData();
	}, []);
	const deleteInterview = async () => {
		try {
			const resp = await DeleteInterviewApi({ room_id: Number(selectedRowKeys[0]) });
			if (resp.success === false) {
				message.error("删除失败");
			} else {
				message.success("删除成功");
			}
		} finally {
			navigate("/interview/list");
		}
	};
	const rowSelection = {
		type: "radio",
		onChange: (newSelectedRowKeys: React.Key[]) => {
			console.log("selectedRowKeys", newSelectedRowKeys);
			setSelectedRowKeys(newSelectedRowKeys);
		}
	};
	const columns: TableColumnsType[DataType] = [
		{
			title: "房间ID",
			dataIndex: "room_id",
			key: "room_id",
			align: "center"
		},
		{
			title: "创建者ID",
			dataIndex: "hr_id",
			key: "hr_id",
			align: "center"
		},
		{
			title: "参与人员ID",
			dataIndex: "user_id",
			key: "user_id",
			align: "center"
			// width: "50%"
		},
		{
			title: "面试信息",
			dataIndex: "desc",
			key: "desc",
			align: "center"
		},
		{
			title: "开始时间",
			dataIndex: "start_time",
			key: "start_time",
			align: "center"
		},
		{
			title: "结束时间",
			dataIndex: "end_time",
			key: "end_time",
			align: "center"
		}
	];
	return (
		<div className="card content-box">
			<div className="date">
				<span>切换国际化的时候看我 😎 ：</span>
				<RangePicker />
			</div>
			<div>
				<Space>
					<Button type="primary" onClick={deleteInterview} disabled={!selectedRowKeys.length}>
						删除选中的文章
					</Button>
				</Space>
			</div>
			<Table rowSelection={rowSelection} dataSource={datasource} columns={columns} rowKey={record => record.room_id} />
		</div>
	);
};

export default List;

function formatToYYYYMMDDHHMM(timestamp: number) {
	const date = new Date(timestamp * 1000); // 将时间戳（秒）转换为毫秒
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1; // getUTCMonth() 返回的是 0-11，需要加1
	const day = date.getUTCDate();
	const hour = date.getUTCHours();
	const minute = date.getUTCMinutes();
	return parseInt(
		`${year}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}${hour.toString().padStart(2, "0")}${minute
			.toString()
			.padStart(2, "0")}`
	);
}
