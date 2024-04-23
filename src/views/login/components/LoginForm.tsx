import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi } from "@/api/modules/login";
import { HOME_URL } from "@/config/config";
import { connect } from "react-redux";
import { setToken } from "@/redux/modules/global/action";
import { useTranslation } from "react-i18next";
import { setTabsList } from "@/redux/modules/tabs/action";
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
// https://kimi.moonshot.cn/share/cog9nbsudu6fc0133ce0
const LoginForm = (props: any) => {
	const { t } = useTranslation();
	const { setToken, setTabsList } = props;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	// 登录
	const onFinish = async (loginForm: Login.ReqLoginForm) => {
		try {
			setLoading(true);
			const data = await loginApi(loginForm);
			if (!data) {
				message.error("后端返回数据为空");
				throw new Error("后端返回数据为空");
			}
			console.log("data", data);
			setToken(data?.token?.access_token);
			if (data?.userId === undefined && data?.token?.access_token === undefined) {
				message.error("登录失败");
				throw new Error("登录失败");
			}
			localStorage.setItem("token", data?.token?.access_token);
			localStorage.setItem("user_id", String(data?.userId));
			setTabsList([]);
			message.success("登录成功！");
			navigate(HOME_URL);
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
				<Input placeholder="用户名：admin / user" prefix={<UserOutlined />} />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
				<Input.Password autoComplete="new-password" placeholder="密码：123456" prefix={<LockOutlined />} />
			</Form.Item>
			{/* https://kimi.moonshot.cn/share/cog9riitnn0rmspbbdi0  */}
			<Form.Item className="login-btn">
				<Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
					{t("login.confirm")}
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
						navigate("/register");
					}}
					icon={<UserOutlined />}
				>
					{t("注册账号")}
				</Button>
			</Form.Item>
		</Form>
	);
};

const mapDispatchToProps = { setToken, setTabsList };
export default connect(null, mapDispatchToProps)(LoginForm);
