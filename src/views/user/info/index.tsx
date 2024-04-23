import React from "react";
import { Card, Avatar, Typography, Image } from "antd";
const { Text, Title } = Typography;

// 假设用户信息对象如下：
const userInfo = {
	userId: "12345",
	userName: "John Doe",
	avatarUrl: "https://bsavatar.oss-cn-shanghai.aliyuncs.com/1713185990357_aaaaaaaaa%281%29.png",
	resumeUrl: "https://bsresume.oss-cn-shanghai.aliyuncs.com/1713199456870_%E7%AE%80%E5%8E%861.png",
	phone: "123-456-7890"
};

const UserProfile = () => {
	return (
		<Card hoverable style={{ width: 300 }} cover={<Image alt="用户简历" src={userInfo.resumeUrl} />}>
			<Card.Meta
				avatar={<Avatar>{userInfo.userName[0]}</Avatar>}
				title={<Title level={4}>{userInfo.userName}</Title>}
				description={
					<>
						<Text strong>ID: </Text>
						<Text>{userInfo.userId}</Text>
						<br />
						<Text strong>手机: </Text>
						<Text>{userInfo.phone}</Text>
					</>
				}
			/>
		</Card>
	);
};

export default UserProfile;
