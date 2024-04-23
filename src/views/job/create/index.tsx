import { Button, Form, Input, message } from "antd";
import "./index.less";
import moment from "moment";
import { useState } from "react";
import { CreateJobApi } from "@/api/modules/job";
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
			const data = await CreateJobApi({
				desc: values.desc,
				content: values.content,
				salary: values.salary,
				address: values.address,
				company: values.company
			});
			if (!data) {
				message.error("后端返回数据为空");
				navigate("/job/create");
				throw new Error("后端返回数据为空");
			}
			if (data?.code === 500) {
				message.error("创建失败！");
				throw new Error("创建失败");
			}
			console.log("data", data);
			if (data?.success === true && data?.job_id !== undefined) {
				message.success("创建成功！");
				navigate("/job/listuser");
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

	// const onReset = () => {
	// 	form.resetFields();
	// };

	// const onFill = () => {
	// 	form.setFieldsValue({
	// 		user: "mark",
	// 		note: "Hello world!",
	// 		gender: "male"
	// 	});
	// };

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
			<Form.Item label="desc" name="desc" rules={[{ required: true, message: "请输入岗位描述" }]}>
				<Input placeholder="Enter desc" />
			</Form.Item>
			<Form.Item label="content" name="content" rules={[{ required: true, message: "请输入岗位信息" }]}>
				<Input placeholder="Enter content" />
			</Form.Item>
			<Form.Item label="salary" name="salary" rules={[{ required: true, message: "请输入岗位薪水" }]}>
				<Input placeholder="Enter salary" />
			</Form.Item>
			<Form.Item label="address" name="address" rules={[{ required: true, message: "请输入公司地址" }]}>
				<Input placeholder="Enter address" />
			</Form.Item>
			<Form.Item label="company" name="company" rules={[{ required: true, message: "请输入公司名" }]}>
				<Input placeholder="Enter company" />
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
