// @ts-nocheck
import { Button, Form, Input, message, DatePicker } from "antd";
import "./index.less";
import moment from "moment";
import { useState } from "react";
import { CreateInterViewApi } from "@/api/modules/interview";
import { useNavigate } from "react-router-dom";
const BasicForm = () => {
	// const { Option } = Select;
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			// starttime = starttime / 1000;
			const starttime = Math.floor(values.start_time.valueOf() / 1000);
			const endtime = Math.floor(values.end_time.valueOf() / 1000);
			// console.log(starttime, endtime);
			// message.success("提交的数据为 : " + JSON.stringify(values));
			// console.log(JSON.stringify(values));
			const data = await CreateInterViewApi({
				user_id: Number(values.user_id),
				password: values.password,
				desc: values.desc,
				start_time: starttime,
				end_time: endtime
			});
			if (!data) {
				message.error("后端返回数据为空");
				navigate("/interview/createroom");
				throw new Error("后端返回数据为空");
			}
			if (data?.code === 500) {
				message.error("创建失败！");
				throw new Error("创建失败");
			}
			console.log("data", data);
			if (data?.success === true && data?.room_id !== undefined) {
				message.success("创建成功！");
				navigate("/interview/list");
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
			<Form.Item label="user_id" name="user_id" rules={[{ required: true, message: "Please input the ID!" }]}>
				<Input placeholder="Enter ID" />
			</Form.Item>
			<Form.Item label="password" name="password" rules={[{ required: true, message: "Please input the password!" }]}>
				<Input placeholder="Enter password" />
			</Form.Item>
			<Form.Item label="desc" name="desc" rules={[{ required: true, message: "Please input the desc!" }]}>
				<Input placeholder="Enter desc" />
			</Form.Item>
			<Form.Item label="start_time Time" name="start_time" rules={[{ required: true, message: "Please select start time!" }]}>
				<DatePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />
			</Form.Item>
			<Form.Item label="end_time Time" name="end_time" rules={[{ required: true, message: "Please select end time!" }]}>
				<DatePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit" loading={loading}>
					Create Room
				</Button>
			</Form.Item>
		</Form>
	);
};

export default BasicForm;
