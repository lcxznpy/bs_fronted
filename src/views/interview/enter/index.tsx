// import Password from "antd/lib/input/Password";
import React, { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";

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
	const [peerId, setPeerId] = useState("");
	// const [remotePeerId, setRemotePeerId] = useState("");
	const [peers, setPeers] = useState<string[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
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
	useEffect(() => {
		console.log(remoteVideoRef.current); // 查看是否有视频DOM元素
	}, []);
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
				handleSDP(message.messageData.sdp, message.type, message.fromPeerId || "");
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
	// const sendMessage = (type: string, data: any) => {
	// 	if (wsConnRef.current) {
	// 		wsConnRef.current.send(JSON.stringify({ type, ...data }));
	// 	}
	// };
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
		}
	};

	const handleICEConnectionStateChange = () => {
		console.log("ICE Connection State Change:", rtcPeerConnRef.current?.iceConnectionState);
	};

	const handleTrack = async (event: RTCTrackEvent) => {
		if (!remoteStreamRef.current) {
			remoteStreamRef.current = new MediaStream() as MediaStreamWithTracks;
			if (remoteVideoRef.current) {
				// remoteVideoRef.current.srcObject = remoteStreamRef.current;
				console.log("video trueeeeeeeeeee");
			}
		}
		// remoteVideoRef.current.srcObject = remoteStreamRef.current;
		console.log("remote_track", event.track);
		remoteStreamRef.current.addTrack(event.track);
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

	const handleLogin = () => {
		if (!peerId) {
			alert("请输入有效的用户ID");
			return;
		}
		setPeerId(peerId);
		console.log(peerId);
		if (!isConnected) {
			wsConnRef.current = new WebSocket(`wss://${window.location.hostname}:4445/?peerId=${peerId}`);
			console.log(`0hostname${window.location.hostname}`);
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
	};

	return (
		<div>
			<input value={peerId} onChange={e => setPeerId(e.target.value)} placeholder="Enter your Peer ID" />
			<input id="Password" placeholder="Enter your password" />
			<button onClick={handleLogin}>{isConnected ? "Logout" : "Login"}</button>
			<div>
				{peers.map(peer => (
					<button key={peer} onClick={() => startCall(true, peer)}>
						{peer}
					</button>
				))}
			</div>
			<video ref={localVideoRef} autoPlay></video>
			<video ref={localVideoRef} autoPlay></video>
			{/* <video ref={remoteVideoRef} autoPlay></video> */}
			{/* <video ref={localVideoRef} autoPlay muted />
			<video ref={remoteVideoRef} autoPlay muted /> */}
			<p>Video should be above this text.</p>
			{/* 其他 UI 元素 */}
		</div>
	);
};

export default VideoChatApp;
