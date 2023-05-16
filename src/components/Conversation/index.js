import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledConversation, {Conversations, MyChatBubble, MyImageChatBubble} from "./style";
import TitleBar from "components/TitleBar";
import ChatBubble from "components/ChatBubble";
import VoiceMessage from "components/VoiceMessage";
import Emoji from "components/Emoji";
import Footer from "components/Footer";
import {useSpring} from "react-spring";
import PubSub from "pubsub-js";
import {useDispatch, useSelector} from "react-redux";
import {formatTime} from "../../utils/formatTime";
import {modifyMessageList} from "../../store/festures/message/messageSlice";
import note4 from "assets/images/note-4.jpg"
import ImageChatBubble from "../ImageChatBubble";
import {Image} from 'antd';
import ReactPlayer from 'react-player/lazy'
import {PlayCircleOutlined} from "@ant-design/icons";
import {syncConversationList} from "../../store/festures/conversation/conversationListSlice";


function Conversation({onAvatarClick, onVideoClicked, children, ...rest}) {

    const tBarAnimeProps = useSpring({
        opacity: 1,
        transform: "translate3d(0px, 0px, 0px)",
        from: {opacity: 0, transform: "translate3d(0px, -50px, 0px)"},
        delay: 500,
    });

    const convsAnimeProps = useSpring({
        opacity: 1,
        transform: "translate3d(0px, 0px, 0px)",
        from: {opacity: 0, transform: "translate3d(50px, 0px, 0px)"},
        delay: 600,
    });

    const ftAnimeProps = useSpring({
        opacity: 1,
        transform: "translate3d(0px, 0px, 0px)",
        from: {opacity: 0, transform: "translate3d(0px, 50px, 0px)"},
        delay: 750,
    });

    const message = useSelector(state => state.messageList)
    const friendInfo = useSelector(state => state.friendInfo)
    const messageList = message[friendInfo.userId]
    const dispatch = useDispatch()


    useEffect(() => {
        const idToken = PubSub.subscribe("messageId", (_, data) => {
            console.log(data)
        })

        const keyToken = PubSub.subscribe("messageKey", (_, data) => {

        })

        const P2PMessageToken = PubSub.subscribe("P2PMessage", (_, data) => {
            const messageBody = JSON.parse(data.messageBody)
            const messageInfo = {
                isAccept: true,
                type: messageBody.type,
                messageContent: messageBody.content,
                messageId: data.messageId,
                messageKey: data.messageKey,
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
        })

        return () => {
            PubSub.unsubscribe(idToken)
            PubSub.unsubscribe(keyToken)
            PubSub.unsubscribe(P2PMessageToken)
        }

    }, [])

    return (
        <StyledConversation {...rest}>
            <TitleBar
                onVideoClicked={onVideoClicked}
                onAvatarClick={onAvatarClick}
                animeProps={tBarAnimeProps}
                toinfo={friendInfo}
            />
            <Conversations style={convsAnimeProps}>
                <ChatBubble time="昨天 下午14：26">Hi 小宇，忙什么呢？</ChatBubble>
                <ChatBubble time="昨天 下午18：30">
                    <VoiceMessage src={"https://vistara.oss-cn-hangzhou.aliyuncs.com/im-data/audio.webm"}/>
                </ChatBubble>
                <MyChatBubble time="昨天 下午16：30">
                    明天约一把王者荣耀，不连赢5把不罢休 🤘
                    <Emoji label="smile">🤘</Emoji>
                </MyChatBubble>
                {
                    messageList && messageList.map(message => {
                        if (message.isAccept) {
                            if (message.type === 1) {
                                return <ChatBubble key={message.messageId}
                                                   time={formatTime(message.messageTime)}>{message.messageContent}</ChatBubble>
                            } else if (message.type === 2) {
                                return <ImageChatBubble key={message.messageId}
                                                        time={formatTime(message.messageTime)}>
                                    <Image src={message.messageContent} width={200}></Image>
                                </ImageChatBubble>
                            } else if (message.type === 3) {
                                return <ChatBubble key={message.messageId}
                                                   time={formatTime(message.messageTime)}>
                                    <VoiceMessage src={message.messageContent}/>
                                </ChatBubble>
                            } else if (message.type === 4) {
                                return <ImageChatBubble key={message.messageId}
                                                        time={formatTime(message.messageTime)}>
                                    <ReactPlayer
                                        url={message.messageContent}
                                        width={'100%'}
                                        // height={'100%'}
                                        controls
                                    />
                                </ImageChatBubble>
                            }
                        } else {
                            if (message.type === 1) {
                                return <MyChatBubble key={message.messageId}
                                                     time={formatTime(message.messageTime)}>{message.messageContent}</MyChatBubble>
                            } else if (message.type === 2) {
                                return <MyImageChatBubble key={message.messageId}
                                                          time={formatTime(message.messageTime)}>
                                    <Image src={message.messageContent} width={200}></Image>
                                </MyImageChatBubble>
                            } else if (message.type === 3) {
                                return <MyChatBubble key={message.messageId}
                                                     time={formatTime(message.messageTime)}>
                                    <VoiceMessage src={message.messageContent} type={'mine'}/>
                                </MyChatBubble>
                            } else if (message.type === 4) {
                                return <MyImageChatBubble key={message.messageId}
                                                          time={formatTime(message.messageTime)}>
                                    <ReactPlayer
                                        url={message.messageContent}
                                        width={'100%'}
                                        // height={'100%'}
                                        controls
                                    />
                                </MyImageChatBubble>
                            }
                        }
                    })
                }
            </Conversations>
            <Footer animeProps={ftAnimeProps}/>
        </StyledConversation>
    );
}

Conversation.propTypes = {
    children: PropTypes.any,
};

export default Conversation;
