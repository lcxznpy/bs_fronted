import { message } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { CheckApi } from "@/api/modules/interview";
import { useNavigate } from "react-router-dom";
import "./index.less";
// import { Interview } from "@/api/interface";
// import { error } from "console";

interface MediaStreamWithTracks extends MediaStream {
	addTrack(track: MediaStreamTrack): void;
}

interface RTCIceCandidateMessage {
	messageId: string;
	type: string;
	fromPeerId: string;
	toPeerId: string;
	messageData: {
		candidate: RTCIceCandidate;
	};
}

interface PeerMessage {
	messageId: string;
	type?: string;
	fromPeerId?: string;
	messageData: {
		peerList?: string[];
		peerId?: string;
		sdp?: RTCSessionDescriptionInit;
		candidate?: RTCIceCandidateInit;
	};
}

interface RTCSessionDescriptionMessage {
	messageId: string;
	type: string;
	fromPeerId: string;
	toPeerId: string;
	messageData: {
		sdp: RTCSessionDescriptionInit;
	};
}

const ICE_CFG: RTCConfiguration = {
	iceServers: [
		{
			urls: "turn:47.102.119.88:3478", // 请替换成你自己搭建的STUN/TURN服务地址
			username: "dhxdl666",
			credential: "dhxdl666LC!"
		}
	]
};

const VideoChatApp: React.FC = () => {
	const [roomId, setRoomId] = useState("");
	const [password, setPassword] = useState("");
	const [peerId, setPeerId] = useState("");
	const [remoteID, setRemoteID] = useState("");
	// const [remotePeerId, setRemotePeerId] = useState("");
	const navigate = useNavigate();
	const [peers, setPeers] = useState<string[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	let remoteVideoRef = useRef<HTMLVideoElement>(null);
	const wsConnRef = useRef<WebSocket | null>(null);
	const rtcPeerConnRef = useRef<RTCPeerConnection | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const remoteStreamRef = useRef<MediaStreamWithTracks | null>(null);
	// useEffect(() => {
	// 	console.log(remotePeerId); //dx1
	// }, [remotePeerId]);
	useEffect(() => {
		return () => {
			closeConnections();
		};
	}, []);
	// useEffect(() => {
	// 	console.log("remoteVideoRef.current", remoteVideoRef.current); // 查看是否有视频DOM元素
	// }, []);
	useEffect(() => {
		return () => {
			if (wsConnRef.current) {
				wsConnRef.current.close();
			}
			if (rtcPeerConnRef.current) {
				rtcPeerConnRef.current.close();
			}
		};
	}, []);
	const createOffer = async (remoteId: string) => {
		if (!rtcPeerConnRef.current || !wsConnRef.current || !remoteId) {
			console.log(!rtcPeerConnRef.current, !wsConnRef.current, !remoteId);
			console.error("RTCPeerConnection is not initialized or no WebSocket connection.");
			return;
		}

		try {
			const offer = await rtcPeerConnRef.current.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
			});
			await rtcPeerConnRef.current.setLocalDescription(offer);
			console.log("toPeerId", remoteId);
			const sdpMessage: RTCSessionDescriptionMessage = {
				messageId: "PROXY",
				type: "sdp",
				fromPeerId: peerId,
				toPeerId: remoteId,
				messageData: {
					sdp: offer
				}
			};
			wsConnRef.current.send(JSON.stringify(sdpMessage));
		} catch (error) {
			console.error("Failed to create or send the offer:", error);
		}
	};
	const handleMessage = (message: PeerMessage) => {
		switch (message.messageId) {
			case "CURRENT_PEERS":
				setPeers(message.messageData.peerList || []);
				break;
			case "PEER_JOIN":
				if (message.messageData.peerId) {
					setPeers(prevPeers => [...prevPeers, message.messageData.peerId as string]);
				}
				break;
			case "PEER_LEAVE":
				if (message.messageData.peerId) {
					setPeers(prevPeers => prevPeers.filter(id => id !== message.messageData.peerId));
				}
				break;
			case "PROXY":
				handleProxyMessage(message);
				break;
			default:
				console.log("Received unknown message type:", message);
		}
	};
	const handleProxyMessage = (message: PeerMessage) => {
		const { type } = message;
		const qaq = message.messageData?.sdp?.type;

		console.log(type);
		switch (type) {
			case "start_call":
				console.log("start_call ", message.fromPeerId);
				startCall(false, message.fromPeerId || "");
				break;
			case "receive_call":
				console.log(!rtcPeerConnRef.current);
				if (!rtcPeerConnRef.current) return;
				console.log("receive ", message.fromPeerId);
				createOffer(message.fromPeerId || "");
				break;
			case "sdp":
				console.log(!rtcPeerConnRef.current);
				if (!rtcPeerConnRef.current) return;
				console.log("sdp ", message.fromPeerId);
				handleSDP(message.messageData.sdp, qaq, message.fromPeerId || "");
				break;
			case "candidate":
				console.log(!rtcPeerConnRef.current);
				if (!rtcPeerConnRef.current) return;
				console.log("candidate ", message.fromPeerId);
				handleCandidate(message.messageData.candidate);
				break;
			default:
				console.log("Received unknown proxy type:", type);
		}
	};
	const handleSDP = async (sdp: RTCSessionDescriptionInit | undefined, type: string | undefined, remoteId: string) => {
		if (!rtcPeerConnRef.current || !sdp) return;

		try {
			if (type === "offer") {
				await rtcPeerConnRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
				const answer = await rtcPeerConnRef.current.createAnswer();
				await rtcPeerConnRef.current.setLocalDescription(answer);
				console.log("toPeerId", remoteId);
				const sdpMessage: RTCSessionDescriptionMessage = {
					messageId: "PROXY",
					type: "sdp",
					fromPeerId: peerId,
					toPeerId: remoteId!,
					messageData: {
						sdp: answer
					}
				};
				wsConnRef.current?.send(JSON.stringify(sdpMessage));
			} else if (type === "answer") {
				await rtcPeerConnRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
			}
		} catch (error) {
			console.error("Failed to handle SDP:", error);
		}
	};

	const handleCandidate = async (candidate: RTCIceCandidateInit | undefined) => {
		if (!rtcPeerConnRef.current || !candidate) return;

		try {
			await rtcPeerConnRef.current.addIceCandidate(new RTCIceCandidate(candidate));
		} catch (error) {
			console.error("Failed to add ICE candidate:", error);
		}
	};
	const handleICECandidate = (remoteId: string) => (event: RTCPeerConnectionIceEvent) => {
		if (event.candidate && remoteId && wsConnRef.current) {
			// console.log("toPeerId", remoteId);
			const proxyCandidateMessage: RTCIceCandidateMessage = {
				messageId: "PROXY",
				type: "candidate",
				fromPeerId: peerId,
				toPeerId: remoteId,
				messageData: {
					candidate: event.candidate
				}
			};
			wsConnRef.current.send(JSON.stringify(proxyCandidateMessage));
			console.log("ice candidate sent", event.candidate);
		} else {
			console.log("");
			console.log("failed to send candidate", event.candidate);
		}
	};

	const handleICEConnectionStateChange = () => {
		console.log("ICE Connection State Change:", rtcPeerConnRef.current?.iceConnectionState);
	};

	const handleTrack = async (event: RTCTrackEvent) => {
		if (!remoteStreamRef.current) {
			remoteStreamRef.current = new MediaStream() as MediaStreamWithTracks;
			console.log("create remotestreamRef");
		}
		if (remoteVideoRef.current) {
			remoteVideoRef.current.srcObject = remoteStreamRef.current;
			console.log("set remoteVideoRef src success");
		}

		console.log("remote_track", event.track);
		remoteStreamRef.current.addTrack(event.track);
		console.log("success send track");
	};

	const createRTCPeerConnection = (remoteId: string) => {
		if (rtcPeerConnRef.current) return;
		rtcPeerConnRef.current = new RTCPeerConnection(ICE_CFG);
		rtcPeerConnRef.current.onicecandidate = handleICECandidate(remoteId || "");
		rtcPeerConnRef.current.oniceconnectionstatechange = handleICEConnectionStateChange;
		rtcPeerConnRef.current.ontrack = handleTrack;
	};

	const closeConnections = () => {
		localStreamRef.current?.getTracks().forEach(track => track.stop());
		localStreamRef.current = null;
		rtcPeerConnRef.current?.close();
		rtcPeerConnRef.current = null;
		wsConnRef.current?.close();
		wsConnRef.current = null;
		setIsConnected(false);
	};

	const startCall = async (isInitiator: boolean, remoteId: string) => {
		console.log(remoteId);
		// await setRemotePeerId(remoteId);
		// console.log(remotePeerId); // nil
		console.log("createRtconn", remoteId);
		createRTCPeerConnection(remoteId || "");
		localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		if (localVideoRef.current) {
			localVideoRef.current.srcObject = localStreamRef.current;
		}
		localStreamRef.current.getTracks().forEach(track => {
			console.log(track);
			// 将本地track添加到RTCPeerConnection实例中
			rtcPeerConnRef.current?.addTrack(track);
		});
		if (isInitiator && wsConnRef.current) {
			console.log("frompeerid", peerId);
			console.log("topeerid", remoteId);
			const startCallMessage = {
				messageId: "PROXY",
				type: "start_call",
				fromPeerId: peerId,
				toPeerId: remoteId
			};
			wsConnRef.current.send(JSON.stringify(startCallMessage));
		} else if (!isInitiator && wsConnRef.current) {
			const receiveCallMessage = {
				messageId: "PROXY",
				type: "receive_call",
				fromPeerId: peerId,
				toPeerId: remoteId
			};
			wsConnRef.current.send(JSON.stringify(receiveCallMessage));
		}
	};
	const Check = async (roomId: string, password: string) => {
		try {
			// let req: Interview.CheckReq = ;
			const data = await CheckApi({ room_id: Number(roomId), password: password });
			console.log("in data", data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		console.log("Updated MyId:", peerId, "Updated remoteId:", remoteID);
		// 在这里你可以根据新的状态值执行其他逻辑
	}, [remoteID, peerId]);
	const handleLogin = async () => {
		// if (!peerId) {
		// 	alert("请输入有效的用户ID");
		// 	return;
		// }
		try {
			if (!roomId) {
				message.warn("请输入有效的房间ID");
				return;
			}
			if (!password) {
				message.warn("请输入有效的密码");
				return;
			}
			setRoomId(roomId);
			setPassword(password);
			setPeerId(peerId);
			setRemoteID(remoteID);
			console.log("roomID:", roomId, "password:", password, "peerid:", peerId, "remoteid:", remoteID);
			const data = await Check(roomId, password);
			console.log("data", data);
			if (data.success === false || data.success === undefined) {
				if (data.code === 1) {
					message.error("密码错误");
					return;
				} else if (data.code === 2) {
					message.error("房间不存在");
					return;
				} else if (data.code === 3) {
					message.error("不在时间范围内");
					return;
				} else if (data.code === 4) {
					message.error("服务器错误");
					return;
				} else if (data.code === 5) {
					message.error("用户不匹配");
					return;
				} else {
					message.error("服务器错误");
				}
			}
			if (data.code === 0 && data.success === true) {
				message.success("验证身份成功");
			}
			console.log(data.remote_id, data.my_id);
			if (String(data.my_id) !== peerId) {
				message.error("输入的(你的id)与真正的id不符");
				navigate("/interview/list");
			} else if (String(data.remote_id) !== remoteID) {
				message.error("输入的(另一个人的id)与真正的id不符");
				navigate("/interview/list");
			}
			if (!isConnected) {
				wsConnRef.current = new WebSocket(`wss://${window.location.hostname}:4445/?peerId=${peerId}&remoteId=${remoteID}`);
				console.log(`hostname${window.location.hostname}`);
				message.success("进入房间成功");
				wsConnRef.current.onopen = () => {
					console.log("Connected to signaling server");
					setIsConnected(true);
				};
				wsConnRef.current.onmessage = event => {
					const message = JSON.parse(event.data);
					handleMessage(message);
				};
				wsConnRef.current.onerror = error => {
					console.log("WebSocket error:", error);
				};
				wsConnRef.current.onclose = () => {
					console.log("WebSocket connection closed");
					setIsConnected(false);
				};
			} else {
				closeConnections();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<input value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="请输入房间id" />
			<input value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入房间密码" />
			<input value={peerId} onChange={e => setPeerId(e.target.value)} placeholder="你的id" />
			<input value={remoteID} onChange={e => setRemoteID(e.target.value)} placeholder="另一个人的id" />
			<button onClick={handleLogin}>{isConnected ? "Logout" : "Login"}</button>
			<div>
				{peers.map(peer => (
					<button key={peer} onClick={() => startCall(true, peer)}>
						{peer}
					</button>
				))}
			</div>
			<div className="video-container">
				<div>
					<p>本地视角</p>
					<video ref={localVideoRef} autoPlay></video>
				</div>
				<div>
					<p>对方视角</p>
					<video ref={remoteVideoRef} autoPlay></video>
				</div>
			</div>
		</div>
	);
};

export default VideoChatApp;
