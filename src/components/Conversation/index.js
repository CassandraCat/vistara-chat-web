import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledConversation, {Conversations, MyChatBubble} from "./style";
import TitleBar from "components/TitleBar";
import ChatBubble from "components/ChatBubble";
import VoiceMessage from "components/VoiceMessage";
import Emoji from "components/Emoji";
import Footer from "components/Footer";
import {useSpring} from "react-spring";
import PubSub from "pubsub-js";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../store";
import moment from "moment";
import {formatTime} from "../../utils/formatTime";
import {modifyMessageList} from "../../store/festures/message/messageSlice";

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
            dispatch(modifyMessageList({
                friendId: data.fromId,
                messageInfo: {
                    isAccept: true,
                    messageContent: messageBody.content,
                    messageId: data.messageId,
                    messageKey: data.messageKey,
                    messageTime: data.messageTime
                }
            }))
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
                <MyChatBubble time="昨天 下午16：30">
                    Hello 啊！最近就是一直在加班改 bug，然后 怼产品，怼 UI，各种怼！
                </MyChatBubble>
                <ChatBubble time="昨天 下午18：30">
                    <VoiceMessage time="01:24"/>
                </ChatBubble>
                <MyChatBubble time="昨天 下午16：30">
                    明天约一把王者荣耀，不连赢5把不罢休 🤘
                    <Emoji label="smile">🤘</Emoji>
                </MyChatBubble>
                {
                    messageList && messageList.map(message => {
                        if (message.isAccept) {
                            return <ChatBubble key={message.messageId} time={formatTime(message.messageTime)}>{message.messageContent}</ChatBubble>
                        } else {
                            return <MyChatBubble key={message.messageId} time={formatTime(message.messageTime)}>{message.messageContent}</MyChatBubble>
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
