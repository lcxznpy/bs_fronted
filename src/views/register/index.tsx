import loginLeft from "@/assets/images/login_left.png";
import logo from "@/assets/images/logo.png";
import "./index.less";
import SwitchDark from "@/components/SwitchDark";
import RegisterForm from "@/views/register/components/RegisterForm";

const Register = () => {
	return (
		<div className="login-container">
			<SwitchDark />
			<div className="login-box">
				<div className="login-left">
					<img src={loginLeft} alt="login" />
				</div>
				<div className="login-form">
					<div className="login-logo">
						<img className="login-icon" src={logo} alt="logo" />
						<span className="logo-text">webrtc面试系统</span>
					</div>
					<RegisterForm />
				</div>
			</div>
		</div>
	);
};

export default Register;
