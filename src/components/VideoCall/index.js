import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import StyledVideoCall, {
    Minimize,
    Actions,
    Action,
    Self,
    VideoCallAlert, StyledVideos, LocalVideo, RemoteVideo,
} from "./style";
import videoCaller from "assets/images/video-caller.jpg";
import face from "assets/images/face-male-1.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCompressAlt,
    faMicrophone,
    faPhoneSlash,
    faVolumeMute,
    faVideo, faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "components/Avatar";
import Paragraph from "components/Paragraph";


import "styled-components/macro";
import {useSdk} from "../../sdk/SdkContext";
import PubSub from "pubsub-js";
import {useDispatch, useSelector} from "react-redux";
import {message} from "antd";
import {syncConversationList} from "../../store/festures/conversation/conversationListSlice";
import {modifyMessageList} from "../../store/festures/message/messageSlice";

function VideoCall({children, isRequest, requestUserId, onHangOffClicked, ...rest}) {

    const [fullScreen, setFullScreen] = useState(true);
    const [isAccept, setIsAccept] = useState(false)
    const [isRemoteMuted, setIsRemoteMuted] = useState(false)
    const [isLocalMuted, setIsLocalMuted] = useState(false)

    const friendInfo = useSelector(state => state.friendInfo)

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const myStream = useRef(null)
    const pc = useRef(null)

    const im = useSdk()
    const dispatch = useDispatch()

    const onAcceptCallHandler = () => {
        setIsAccept(true)
        im.acceptVideoCall(requestUserId, "我已接受你的视频请求")
    }

    const stopLocalStream = () => {
        const localStream = localVideoRef.current.srcObject
        const tracks = localStream.getTracks()

        tracks.forEach((track) => {
            track.stop()
        })
    }

    const closePeerConnection = () => {
        pc.value.close()
    }

    const clearVideoElements = () => {
        localVideoRef.current.srcObject = null
        remoteVideoRef.current.srcObject = null
    }

    const endVideoChat = () => {
        stopLocalStream()
        closePeerConnection()
        clearVideoElements()
    }

    const initStream = () => {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            }).then(function (value) {
                myStream.value = value
                localVideoRef.current.srcObject = value  // 自己的流
            }).then(() => resolve())
                .catch(() => reject())
        })
    }

    const createPeerConnection = () => {
        pc.value = new RTCPeerConnection(null);
        pc.value.onicecandidate = handleIceCandidate
        pc.value.ontrack = handleRemoteStreamAdded
        for (const trac of myStream.value.getTracks()) {
            const constraints = {echoCancellation: true}
            trac.applyConstraints(constraints)
                .then(() => {
                    console.log('Applied audio constraints successfully');
                })
                .catch(error => {
                    console.error('Failed to apply audio constraints:', error);
                });
            pc.value.addTrack(trac, myStream.value)
        }
    }

    const handleIceCandidate = (event) => {
        if (event.candidate) {
            if (isRequest) {
                im.transmitIce(friendInfo.userId, event.candidate)
            } else {
                im.transmitIce(requestUserId, event.candidate)
            }
        }
    }

    const handleRemoteStreamAdded = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0]
    }

    const createOfferAndSendMessage = (sessionDescription) => {
        pc.value.setLocalDescription(sessionDescription)
        im.transmitOffer(friendInfo.userId, sessionDescription)
    }

    const handleCreateOfferError = (error) => {
        message.error(error)
    }

    const createAnswerAndSendMessage = (sessionDescription) => {
        pc.value.setLocalDescription(sessionDescription)
        im.transmitAnswer(requestUserId, sessionDescription)
    }

    const handleCreateAnswerError = (error) => {
        message.error(error)
    }

    const handleHangOff = () => {
        if (isRequest) {
            if (pc.value) {
                const pack = im.hangUpVideoCall(friendInfo.userId, "通话结束")
                const messageBody = JSON.parse(pack.messageBody)
                const messageInfo = {
                    isAccept: false,
                    type: 5,
                    messageContent: messageBody.content,
                    messageId: pack.messageId,
                    messageKey: pack.messageKey || '',
                    messageTime: pack.messageTime
                }
                endVideoChat()
                dispatch(modifyMessageList({
                    friendId: pack.toId,
                    messageInfo
                }))
                dispatch(syncConversationList([{
                    toId: pack.toId,
                    message: messageInfo
                }]))
            } else {
                const pack = im.cancelVideoCall(friendInfo.userId, "已取消")
                const messageBody = JSON.parse(pack.messageBody)
                const messageInfo = {
                    isAccept: false,
                    type: 5,
                    messageContent: messageBody.content,
                    messageId: pack.messageId,
                    messageKey: pack.messageKey || '',
                    messageTime: pack.messageTime
                }
                dispatch(modifyMessageList({
                    friendId: pack.toId,
                    messageInfo
                }))
                dispatch(syncConversationList([{
                    toId: pack.toId,
                    message: messageInfo
                }]))
            }
        } else {
            if (pc.value) {
                const pack = im.hangUpVideoCall(requestUserId, "通话结束")
                const messageBody = JSON.parse(pack.messageBody)
                const messageInfo = {
                    isAccept: false,
                    type: 5,
                    messageContent: messageBody.content,
                    messageId: pack.messageId,
                    messageKey: pack.messageKey || '',
                    messageTime: pack.messageTime
                }
                dispatch(modifyMessageList({
                    friendId: pack.toId,
                    messageInfo
                }))
                dispatch(syncConversationList([{
                    toId: pack.toId,
                    message: messageInfo
                }]))
                endVideoChat()
            } else {
                const pack = im.rejectVideoCall(requestUserId, "已拒绝")
                const messageBody = JSON.parse(pack.messageBody)
                const messageInfo = {
                    isAccept: false,
                    type: 5,
                    messageContent: messageBody.content,
                    messageId: pack.messageId,
                    messageKey: pack.messageKey || '',
                    messageTime: pack.messageTime
                }
                dispatch(modifyMessageList({
                    friendId: pack.toId,
                    messageInfo
                }))
                dispatch(syncConversationList([{
                    toId: pack.toId,
                    message: messageInfo
                }]))
            }
        }
        onHangOffClicked()
    }

    const muteRemoteVideo = () => {
        remoteVideoRef.current.muted = !remoteVideoRef.current.muted
        setIsRemoteMuted(remoteVideoRef.current.muted)
        const audioTracks = remoteVideoRef.current.srcObject.getAudioTracks()
        audioTracks.forEach(track => {
            track.enabled = !remoteVideoRef.current.muted
        })
    }

    const muteLocalVideo = () => {
        localVideoRef.current.muted = !localVideoRef.current.muted
        setIsLocalMuted(localVideoRef.current.muted)
        const audioTracks = localVideoRef.current.srcObject.getAudioTracks()
        audioTracks.forEach(track => {
            track.enabled = !localVideoRef.current.muted
        })
    }

    useEffect(() => {
        const acceptCallToken = PubSub.subscribe("AcceptCall", (_, data) => {
            setIsAccept(true)
            initStream().then(() => {
                if (pc.value === undefined) {
                    createPeerConnection()
                }
                pc.value.createOffer().then(createOfferAndSendMessage, handleCreateOfferError)
            })
        })

        const transmitOfferToken = PubSub.subscribe("TransmitOffer", (_, data) => {
            const messageBody = JSON.parse(data.messageBody)
            const content = messageBody.content
            initStream().then(() => {
                if (pc.value === undefined) {
                    createPeerConnection()
                }
                pc.value.setRemoteDescription(new RTCSessionDescription(content));
                pc.value.createAnswer().then(createAnswerAndSendMessage, handleCreateAnswerError)
            })
        })

        const transmitAnswerToken = PubSub.subscribe("TransmitAnswer", (_, data) => {
            const messageBody = JSON.parse(data.messageBody)
            const content = messageBody.content
            pc.value.setRemoteDescription(new RTCSessionDescription(content));
        })

        const transmitIceToken = PubSub.subscribe("TransmitIce", (_, data) => {
            const messageBody = JSON.parse(data.messageBody)
            const content = messageBody.content
            if (pc.value) {
                pc.value.addIceCandidate(new RTCIceCandidate({
                    sdpMLineIndex: content.sdpMLineIndex,
                    candidate: content.candidate
                }))
            }
        })

        const hangUpCallToken = PubSub.subscribe("HangUpCall", (_, data) => {
            const messageBody = JSON.parse(data.messageBody)
            const messageInfo = {
                isAccept: true,
                type: 5,
                messageContent: messageBody.content,
                messageId: data.messageId,
                messageKey: data.messageKey || '',
                messageTime: data.messageTime
            }
            dispatch(modifyMessageList({
                friendId: data.fromId,
                messageInfo
            }))
            dispatch(syncConversationList([{
                toId: data.fromId,
                message: messageInfo
            }]))

            if (pc.value) {
                endVideoChat()
            }
            onHangOffClicked()
        })

        const cancelCallToken = PubSub.subscribe("CancelCall", (_, data) => {
            const messageBody = JSON.parse(data.messageBody)
            const messageInfo = {
                isAccept: true,
                type: 5,
                messageContent: '对方' + messageBody.content,
                messageId: data.messageId,
                messageKey: data.messageKey || '',
                messageTime: data.messageTime
            }
            dispatch(modifyMessageList({
                friendId: data.fromId,
                messageInfo
            }))
            dispatch(syncConversationList([{
                toId: data.fromId,
                message: messageInfo
            }]))
            if (pc.value) {
                endVideoChat()
            }
            onHangOffClicked()
        })

        const rejectCallToken = PubSub.subscribe("RejectCall", (_, data) => {
            const messageBody = JSON.parse(data.messageBody)
            const messageInfo = {
                isAccept: true,
                type: 5,
                messageContent: '对方' + messageBody.content,
                messageId: data.messageId,
                messageKey: data.messageKey || '',
                messageTime: data.messageTime
            }
            dispatch(modifyMessageList({
                friendId: data.fromId,
                messageInfo
            }))
            dispatch(syncConversationList([{
                toId: data.fromId,
                message: messageInfo
            }]))
            if (pc.value) {
                endVideoChat()
            }
            onHangOffClicked()
        })

        return () => {
            PubSub.unsubscribe(acceptCallToken)
            PubSub.unsubscribe(transmitOfferToken)
            PubSub.unsubscribe(transmitAnswerToken)
            PubSub.unsubscribe(transmitIceToken)
            PubSub.unsubscribe(hangUpCallToken)
            PubSub.unsubscribe(cancelCallToken)
            PubSub.unsubscribe(rejectCallToken)
        }
    }, [])

    if (!fullScreen) {
        return (
            <VideoCallAlert>
                <Avatar
                    src={face}
                    css={`
                        grid-area: avatar;
                    `}
                />
                <Paragraph
                    size="medium"
                    css={`
                        grid-area: info;
                    `}
                >
                    正在跟 PeachZhang 进行视频通话
                </Paragraph>
                <Paragraph
                    type="secondary"
                    css={`
                        grid-area: action;
                        cursor: pointer;
                    `}
                    onClick={() => setFullScreen(true)}
                >
                    点击切换全屏
                </Paragraph>
                <FontAwesomeIcon
                    icon={faVideo}
                    css={`
                        grid-area: icon;
                        font-size: 20px;
                        justify-self: end;
                        opacity: 0.3;
                    `}
                />
            </VideoCallAlert>
        );
    }

    return (
        <StyledVideoCall src={videoCaller} {...rest}>
            <Minimize shape="rect" onClick={() => setFullScreen(false)}>
                <FontAwesomeIcon icon={faCompressAlt}/>
            </Minimize>
            <Actions>
                {
                    (isAccept || isRequest) && (
                        <Action muted={isLocalMuted}>
                            <FontAwesomeIcon icon={faMicrophone} onClick={muteLocalVideo}/>
                        </Action>
                    )
                }
                <Action type="hangoff">
                    <FontAwesomeIcon icon={faPhoneSlash} onClick={handleHangOff}/>
                </Action>
                {
                    (!isAccept && !isRequest) && (
                        <Action type="accept">
                            <FontAwesomeIcon icon={faCheck} onClick={onAcceptCallHandler}></FontAwesomeIcon>
                        </Action>
                    )
                }
                {
                    (isAccept || isRequest) && (
                        <Action muted={isRemoteMuted}>
                            <FontAwesomeIcon icon={faVolumeMute} onClick={muteRemoteVideo}/>
                        </Action>
                    )
                }
            </Actions>
            <StyledVideos>
                <LocalVideo ref={localVideoRef} autoPlay playsInline></LocalVideo>
                <RemoteVideo ref={remoteVideoRef} autoPlay playsInline></RemoteVideo>
            </StyledVideos>
            {
                !isAccept && (
                    <Self src={face} size="140px"/>
                )
            }
        </StyledVideoCall>
    );
}

VideoCall.propTypes = {
    children: PropTypes.any,
};

export default VideoCall;
