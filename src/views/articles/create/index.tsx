// @ts-nocheck
import { Button, Form, Input, message } from "antd";
import "./index.less";
import moment from "moment";
import { useState } from "react";
import { CreateArticleApi } from "@/api/modules/article";
import { useNavigate } from "react-router-dom";
const CreateJob = () => {
	// const { Option } = Select;
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			// message.success("提交的数据为 : " + JSON.stringify(values));
			const data = await CreateArticleApi({
				title: values.title,
				content: values.content
			});
			if (!data) {
				message.error("后端返回数据为空");
				navigate("/article/create");
				throw new Error("后端返回数据为空");
			}
			if (data?.code === 500) {
				message.error("创建失败！");
				throw new Error("创建失败");
			}
			console.log("data", data);
			if (data?.success === true && data?.article_id !== undefined) {
				message.success("创建成功！");
				navigate("/article/listuser");
			}
			if (data?.code !== null && data?.message !== null) {
				console.log(data?.code, data?.message);
				message.error(data?.message);
				throw new Error(data?.message);
			}
			setLoading(false);
		} catch (e) {
			setLoading(false);
			console.log(e);
		}
	};

	return (
		// ...

		<Form
			form={form}
			onFinish={onFinish}
			layout="vertical"
			initialValues={{
				startTime: moment(), // 默认当前时间
				endTime: moment().add(1, "hours") // 默认结束时间为1小时后
			}}
		>
			<Form.Item label="title" name="title" rules={[{ required: true, message: "请输入岗位描述" }]}>
				<Input placeholder="Enter desc" />
			</Form.Item>
			<Form.Item label="content" name="content" rules={[{ required: true, message: "请输入岗位信息" }]}>
				<Input placeholder="Enter content" />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit" loading={loading}>
					Create Room
				</Button>
			</Form.Item>
		</Form>
	);
};

export default CreateJob;
