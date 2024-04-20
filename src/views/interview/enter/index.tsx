import React, { useState, useEffect, useRef } from "react";

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
	const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
	const [peers, setPeers] = useState<string[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const wsConnRef = useRef<WebSocket | null>(null);
	const rtcPeerConnRef = useRef<RTCPeerConnection | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const remoteStreamRef = useRef<MediaStreamWithTracks | null>(null);

	useEffect(() => {
		return () => {
			closeConnections();
		};
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
	const createOffer = async () => {
		if (!rtcPeerConnRef.current || !wsConnRef.current || !remotePeerId) {
			console.log(!rtcPeerConnRef.current, !wsConnRef.current, !remotePeerId);
			console.error("RTCPeerConnection is not initialized or no WebSocket connection.");
			return;
		}

		try {
			const offer = await rtcPeerConnRef.current.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
			});
			await rtcPeerConnRef.current.setLocalDescription(offer);

			const sdpMessage: RTCSessionDescriptionMessage = {
				messageId: "PROXY",
				type: "sdp",
				fromPeerId: peerId,
				toPeerId: remotePeerId,
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
		console.log(!rtcPeerConnRef.current);
		if (!rtcPeerConnRef.current) return;
		console.log(type);
		switch (type) {
			case "start_call":
				startCall(false, message.fromPeerId || "");
				break;
			case "receive_call":
				createOffer();
				break;
			case "sdp":
				handleSDP(message.messageData.sdp, message.type);
				break;
			case "candidate":
				handleCandidate(message.messageData.candidate);
				break;
			default:
				console.log("Received unknown proxy type:", type);
		}
	};
	const handleSDP = async (sdp: RTCSessionDescriptionInit | undefined, type: string | undefined) => {
		if (!rtcPeerConnRef.current || !sdp) return;

		try {
			if (type === "offer") {
				await rtcPeerConnRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
				const answer = await rtcPeerConnRef.current.createAnswer();
				await rtcPeerConnRef.current.setLocalDescription(answer);
				const sdpMessage: RTCSessionDescriptionMessage = {
					messageId: "PROXY",
					type: "sdp",
					fromPeerId: peerId,
					toPeerId: remotePeerId!,
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
	const handleICECandidate = (event: RTCPeerConnectionIceEvent) => {
		if (event.candidate && remotePeerId && wsConnRef.current) {
			const proxyCandidateMessage: RTCIceCandidateMessage = {
				messageId: "PROXY",
				type: "candidate",
				fromPeerId: peerId,
				toPeerId: remotePeerId,
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

	const handleTrack = (event: RTCTrackEvent) => {
		if (!remoteStreamRef.current) {
			remoteStreamRef.current = new MediaStream() as MediaStreamWithTracks;
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = remoteStreamRef.current;
			}
		}
		remoteStreamRef.current.addTrack(event.track);
	};

	const createRTCPeerConnection = () => {
		if (rtcPeerConnRef.current) return;
		rtcPeerConnRef.current = new RTCPeerConnection(ICE_CFG);
		rtcPeerConnRef.current.onicecandidate = handleICECandidate;
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
		setRemotePeerId(remoteId);
		createRTCPeerConnection();
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
			const startCallMessage = {
				messageId: "PROXY",
				type: "start_call",
				fromPeerId: peerId,
				toPeerId: remotePeerId
			};
			wsConnRef.current.send(JSON.stringify(startCallMessage));
		} else if (!isInitiator && wsConnRef.current) {
			const receiveCallMessage = {
				messageId: "PROXY",
				type: "receive_call",
				fromPeerId: peerId,
				toPeerId: remotePeerId
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
			<button onClick={handleLogin}>{isConnected ? "Logout" : "Login"}</button>
			<div>
				{peers.map(peer => (
					<button key={peer} onClick={() => startCall(true, peer)}>
						{peer}
					</button>
				))}
			</div>
			<video ref={localVideoRef} autoPlay muted />
			<video ref={remoteVideoRef} autoPlay />
			{/* 其他 UI 元素 */}
		</div>
	);
};

export default VideoChatApp;
