// @ts-nocheck
import React, { Fragment } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

const Resumeprops: UploadProps = {
	name: "resume",
	action: "https://localhost:4443/v1/upload/resume",
	headers: {
		authorization: localStorage.getItem("token")
	},
	onChange(info) {
		if (info.file.status !== "uploading") {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === "done") {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === "error") {
			info.file.status = "done";
			message.success(`${info.file.name} file uploaded successfully`);
			// message.error(`${info.file.name} file upload failed.`);
		}
	}
};

const Avatarprops: UploadProps = {
	name: "avatar",
	action: "https://localhost:4443/v1/upload/avatar",
	headers: {
		authorization: localStorage.getItem("token")
	},
	onChange(info) {
		if (info.file.status !== "uploading") {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === "done") {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === "error") {
			info.file.status = "done";
			message.success(`${info.file.name} file uploaded successfully`);
			// message.error(`${info.file.name} file upload failed.`);
		}
	}
};

const App: React.FC = () => (
	<Fragment>
		<Upload {...Resumeprops}>
			<Button icon={<UploadOutlined />}>上传简历</Button>
		</Upload>
		<Upload {...Avatarprops}>
			<Button icon={<UploadOutlined />}>上传头像</Button>
		</Upload>
	</Fragment>
);

export default App;
