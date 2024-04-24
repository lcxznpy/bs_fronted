// @ts-nocheck
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Register } from "@/api/interface/register";
import { registerApi, sendCodeApi } from "@/api/modules/register";
import { HOME_URL } from "@/config/config";
import { connect } from "react-redux";
import { setToken } from "@/redux/modules/global/action";
import { useTranslation } from "react-i18next";
import { setTabsList } from "@/redux/modules/tabs/action";
import { UserOutlined, LockOutlined, CloseCircleOutlined, PhoneOutlined } from "@ant-design/icons";

// https://kimi.moonshot.cn/share/cog9nbsudu6fc0133ce0
const RegisterForm = (props: any) => {
	const { t } = useTranslation();
	const { setToken, setTabsList } = props;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	// 登录
	const onFinish = async (RegisterForm: Register.ReqRegisterForm) => {
		try {
			setLoading(true);
			// loginForm.password = md5(loginForm.password);

			const data = await registerApi(RegisterForm);
			if (!data) {
				console.log("data", data);
				throw new Error("后端返回数据为空");
			}
			console.log("data", data);
			if (data?.userId === undefined && data?.token?.access_token === undefined) {
				message.error("登录失败");
				throw new Error("登录失败");
			}
			localStorage.setItem("token", data?.token?.access_token);
			localStorage.setItem("user_id", String(data?.userId));
			setToken(data?.token?.access_token);
			setTabsList([]);
			message.success("登录成功！");
			navigate(HOME_URL);
			setLoading(false);
		} catch (e) {
			console.log(e);
			setLoading(false);
		}

		// finally {
		// 	setLoading(false);
		// }
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const SendCode = async () => {
		try {
			setLoading(true);
			const phone = form.getFieldValue("mobile");
			console.log("phone", phone);
			if (phone == "" || phone == undefined) {
				message.error("请输入手机号");
			}
			const data = await sendCodeApi({ mobile: phone });
			console.log("data", data?.code);
			if (data?.code == "200") {
				console.log("data", data);
				message.success("发送成功");
			} else {
				console.log("data", data);
				message.error("发送失败");
			}
			setLoading(false);
		} catch (e) {
			console.error(e);
			message.success("发送成功");
			setLoading(false);
		}
	};

	return (
		// https://kimi.moonshot.cn/share/cog9soilnl9eil5u3uu0
		<Form
			form={form}
			name="basic"
			labelCol={{ span: 5 }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			size="large"
			autoComplete="off"
		>
			<Form.Item name="name" rules={[{ required: true, message: "请输入用户名" }]}>
				<Input placeholder="用户名" prefix={<UserOutlined />} />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
				<Input.Password autoComplete="new-password" placeholder="密码" prefix={<LockOutlined />} />
			</Form.Item>
			<Form.Item name="mobile" rules={[{ required: true, message: "请输入手机号" }]}>
				<Input placeholder="手机号" prefix={<PhoneOutlined />} />
			</Form.Item>
			<Form.Item name="code" rules={[{ required: true, message: "请输入手机号" }]}>
				<Input placeholder="短信验证码" />
			</Form.Item>
			{/* https://kimi.moonshot.cn/share/cog9riitnn0rmspbbdi0  */}
			<Form.Item className="login-btn">
				<Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
					{t("注册")}
				</Button>
				<Button type="primary" onClick={SendCode} loading={loading} icon={<UserOutlined />}>
					{t("发送验证码")}
				</Button>
				<Button
					onClick={() => {
						form.resetFields();
					}}
					icon={<CloseCircleOutlined />}
				>
					{t("login.reset")}
				</Button>
				<Button
					onClick={() => {
						navigate("/login");
					}}
					icon={<UserOutlined />}
				>
					{t("前往登录页面")}
				</Button>
			</Form.Item>
		</Form>
	);
};

const mapDispatchToProps = { setToken, setTabsList };
export default connect(null, mapDispatchToProps)(RegisterForm);

// 95:button 点击链接查看和 Kimi 智能助手的对话 https://kimi.moonshot.cn/share/coh4aesubms96s0bjuj0
