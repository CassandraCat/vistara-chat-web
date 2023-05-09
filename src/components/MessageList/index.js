import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledMessageList, {ChatList} from "./style";
import PubSub from "pubsub-js"


import MessageCard from "components/MessageCard";

import FilterList from "components/FilterList";
import {animated} from "react-spring";
import useStaggeredList from "hooks/useStaggeredList";
import messageData from "data/messages";
import {useSdk} from "../../sdk/SdkContext";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {syncConversationList} from "../../store/festures/conversation/conversationListSlice";
import face from "assets/images/face-male-2.jpg"

function MessageList({children, ...rest}) {
    const trailAnimes = useStaggeredList(6);

    const im = useSdk()

    const conversationListStore = useSelector(state => state.conversationList)
    const [activeIndex, setActiveIndex] = useState(0)
    const [conversationList, setConversationList] = useState(conversationListStore)

    const dispatch = useDispatch()

    let conversationSequence = window.localStorage.getItem("conversationSequence")

    const changeHandler = (index) => {
        setActiveIndex(index)
        PubSub.publish("showMessage", true)
    }

    useEffect(() => {
        console.log('我是MessageList，我执行了')
        PubSub.subscribe("addConversation", (_, data) => {
            if (data != null) {
                conversationList.forEach(conversation => {
                    if (conversation.toId === data.userId) {
                        data = null
                    }
                })
                data && setConversationList(prevState => [...prevState, {toId: data.userId}])
            }
        })

        if (conversationSequence === null) {
            conversationSequence = 0
            window.localStorage.setItem('conversationSequence', conversationSequence)
        }

        im.syncConversationList(conversationSequence, 100).then(result => {
            if (result.data.maxSequence != null) {
                conversationSequence = result.data.maxSequence
                window.localStorage.setItem("friendSequence", conversationSequence)
            }
            if (result.data.dataList != null) {
                conversationList.forEach(friend => {
                    result.data.dataList = result.data.dataList.filter(item => !_.isEqual(friend, item))
                })
                setTimeout(() => {
                    dispatch(syncConversationList(result.data.dataList))
                }, 0)
                setConversationList(prevState => [...prevState, ...result.data.dataList])
            }
        }).catch(err => {
            throw new Error(err)
        })

    }, [conversationSequence])


    return (
        <StyledMessageList {...rest}>
            <FilterList
                options={["最新消息优先", "在线好友优先"]}
                actionLabel="创建会话"
            >
                <ChatList>
                    {conversationList.map((message, index) => (
                        <animated.div key={message.toId} style={trailAnimes[index]}>
                            <MessageCard
                                key={message.toId}
                                sign={message.toId}
                                active={message.toId === activeIndex}
                                replied={message.replied}
                                avatarSrc={message.avatarSrc ? message.avatarSrc : face}
                                name={message.toId}
                                avatarStatus={message.status ? message.status : "online"}
                                statusText={message.statusText ? message.statusText : '在线'}
                                time={message.time}
                                message={message.message}
                                unreadCount={message.unreadCount}
                                changeActive={changeHandler}
                            />
                        </animated.div>
                    ))}
                </ChatList>
            </FilterList>
        </StyledMessageList>
    );
}

MessageList.propTypes = {
    children: PropTypes.any,
};

export default React.memo(MessageList);
