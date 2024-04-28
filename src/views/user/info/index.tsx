//@ts-nocheck
import React, { Fragment, useEffect, useState } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import { Avatar, message, Typography, Image } from "antd";
import { UserInfoApi } from "@/api/modules/userinfo";

const { Text } = Typography;

interface user {
	id: number;
	username: string;
	avatar: string;
	mobile: string;
	password: string;
	resume: string;
}

const UserInfo = () => {
	//
	const [userInfo, setUserInfo] = useState<user>();
	// const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await UserInfoApi();
				if (!data) {
					console.log("get userinfo error");
					message.error("获取用户信息失败");
					return; // 不再继续执行下面的代码
				}
				setUserInfo(data);
			} catch (error) {
				console.error("错误", error);
				message.error("获取用户信息失败");
			}
		};
		fetchData();
	}, []);
	return (
		<Fragment>
			{userInfo && (
				<>
					<Avatar
						size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
						icon={<AntDesignOutlined />}
						src={userInfo.avatar}
					/>
					<p>姓名</p>
					<Text>{userInfo.username}</Text>
					<p>ID</p>
					<Text>{userInfo.id}</Text>
					<p>手机号</p>
					<Text>{userInfo.mobile}</Text>
					{/* 不建议直接显示密码 */}
					<p>密码</p>
					<Text>{userInfo.password}</Text>
					<p>简历</p>
					<Image width={200} src={userInfo.resume} />
				</>
			)}
		</Fragment>
	);
};
export default UserInfo;
