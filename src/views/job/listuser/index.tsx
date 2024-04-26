// @ts-nocheck
import React, { useEffect, useState } from "react";
import { JobListUserApi, DeleteJobApi } from "@/api/modules/job";
import "./index.less";
import { useNavigate } from "react-router-dom";
import { Table, DatePicker, message, Space, Button } from "antd";
import type { TableColumnsType } from "antd";

interface DataType {
	job_id: React.Key;
	user_id: number;
	desc: string;
	content: string;
	salary: string;
	address: string;
	company: string;
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
				const data = await JobListUserApi();
				console.log(data === undefined);
				console.log(!data);
				if (data) {
					console.log("data", data);
					const jobs = data?.jobs;
					jobs.forEach(element => {
						// console.log("key:", element.job_id);
						datalist.push({
							job_id: element.job_id,
							user_id: element.user_id,
							desc: element.desc,
							content: element.content,
							salary: element.salary,
							address: element.address,
							company: element.company
						});
					});
					const qaq: DataType[] = jobs;
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
	const deleteJob = async () => {
		try {
			const resp = DeleteJobApi({ job_id: Number(selectedRowKeys[0]) });
			if (resp.success === false) {
				message.error("删除失败");
			} else {
				message.success("删除成功");
			}
		} finally {
			navigate("/job/listuser");
		}
	};
	const rowSelection = {
		type: "radio",
		onChange: (newSelectedRowKeys: React.Key[]) => {
			console.log("selectedRowKeys", newSelectedRowKeys);
			setSelectedRowKeys(newSelectedRowKeys);
		}
	};
	const columns: TableColumnsType<DataType> = [
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
			<div>
				<Space>
					<Button type="primary" onClick={deleteJob} disabled={!selectedRowKeys.length}>
						删除选中的文章
					</Button>
				</Space>
			</div>
			<Table rowSelection={rowSelection} dataSource={datasource} columns={columns} rowKey={record => record.job_id} />
		</div>
	);
};

export default List;
