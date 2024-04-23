import React, { Fragment } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

const props: UploadProps = {
	name: "file",
	action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
	headers: {
		authorization: "authorization-text"
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
		<Upload {...props}>
			<Button icon={<UploadOutlined />}>上传简历</Button>
		</Upload>
		<Upload {...props}>
			<Button icon={<UploadOutlined />}>上传头像</Button>
		</Upload>
	</Fragment>
);

export default App;
