// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Table, DatePicker, message, Button, Space } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { ArticleListUserApi, DeleteArticleApi } from "@/api/modules/article";
import { useNavigate } from "react-router-dom";
import type { TableColumnsType } from "antd";

interface DataType {
	article_id: React.Key;
	user_id: number;
	title: string;
	content: string;
}

const ListUser = () => {
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
				const data = await ArticleListUserApi();
				console.log(data === undefined);
				console.log(!data);
				if (data) {
					console.log("data", data);
					const articles = data?.articles;
					articles.forEach(element => {
						// console.log("key:", element.article_id);
						datalist.push({
							article_id: element.article_id,
							user_id: element.user_id,
							title: element.title,
							content: element.content
						});
					});
					// datalist.forEach(element => {
					// 	console.log("element:", element);
					// });
					const qaq: DataType[] = articles;
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
	const deleteArticle = async () => {
		try {
			const resp = DeleteArticleApi({ article_id: Number(selectedRowKeys[0]) });
			if (resp.success === false) {
				message.error("删除失败");
			} else {
				message.success("删除成功");
			}
		} finally {
			navigate("/article/listall");
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
			<div>
				<Space>
					<Button type="primary" onClick={deleteArticle} disabled={!selectedRowKeys.length}>
						删除选中的文章
					</Button>
				</Space>
			</div>
			<Table rowSelection={rowSelection} dataSource={datasource} columns={columns} rowKey={record => record.article_id} />
		</div>
	);
};

export default ListUser;
