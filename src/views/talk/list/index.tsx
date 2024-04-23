import React, { useState } from "react";
import { Layout, List, Avatar, Input, Button, Typography, Divider } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";

const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;

interface Message {
	id: number;
	author: string;
	content: string;
}

interface Contact {
	id: number;
	name: string;
	avatarUrl: string;
}

const ChatApp: React.FC = () => {
	const [currentChatId, setCurrentChatId] = useState<number>(1);

	const messages: { [key: number]: Message[] } = {
		1: [{ id: 1, author: "Alice", content: "Hello, how are you?" }],
		2: [{ id: 2, author: "Bob", content: "I'm fine, thanks! And you?" }]
	};

	const contacts: Contact[] = [
		{ id: 1, name: "Alice", avatarUrl: "" },
		{ id: 2, name: "Bob", avatarUrl: "" }
	];

	return (
		<Layout style={{ height: "100vh" }}>
			<Sider width={200} theme="light">
				<List
					itemLayout="horizontal"
					dataSource={contacts}
					renderItem={item => (
						<List.Item onClick={() => setCurrentChatId(item.id)}>
							<List.Item.Meta avatar={<Avatar icon={<UserOutlined />} src={item.avatarUrl} />} title={item.name} />
						</List.Item>
					)}
				/>
			</Sider>
			<Layout>
				<Header style={{ background: "#f0f2f5", padding: "10px" }}>
					Chat with {contacts.find(c => c.id === currentChatId)?.name}
				</Header>
				<Content style={{ padding: "10px", overflow: "auto" }}>
					{messages[currentChatId]?.map((msg, index) => (
						<div key={index} style={{ margin: "10px 0" }}>
							<Text strong>{msg.author}:</Text>
							<Text> {msg.content}</Text>
							<Divider />
						</div>
					))}
				</Content>
				<Footer style={{ padding: "10px", background: "#fff" }}>
					<Input
						placeholder="Type a message"
						suffix={
							<Button type="text" icon={<SendOutlined />} onClick={() => console.log("Send message")}>
								Send
							</Button>
						}
					/>
				</Footer>
			</Layout>
		</Layout>
	);
};

export default ChatApp;
