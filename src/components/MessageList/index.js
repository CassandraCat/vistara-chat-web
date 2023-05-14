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
import {formatTime} from "../../utils/formatTime";
import {store} from "../../store";

function MessageList({children, ...rest}) {

    console.log('我重新渲染了')

    const trailAnimes = useStaggeredList(6);

    const im = useSdk()

    const conversationListStore = useSelector(state => state.conversationList)

    const [activeIndex, setActiveIndex] = useState(0)
    const [conversationList, setConversationList] = useState(conversationListStore)
    const messageList = useSelector(state => state.messageList)

    const dispatch = useDispatch()

    let conversationSequence = window.localStorage.getItem("conversationSequence")

    const changeHandler = (index) => {
        setActiveIndex(index)
        PubSub.publish("showMessage", true)
    }


    useEffect(() => {

        // store.subscribe(()=>{
        //     const messageList = store.getState().messageList
        //
        // })

        if (conversationSequence === null) {
            conversationSequence = 0
            window.localStorage.setItem('conversationSequence', conversationSequence)
        }

        // im.syncConversationList(conversationSequence, 100).then(result => {
        //     if (result.data.maxSequence != null) {
        //         conversationSequence = result.data.maxSequence
        //         window.localStorage.setItem("friendSequence", conversationSequence)
        //     }
        //     if (result.data.dataList != null) {
        //         conversationList.forEach(friend => {
        //             result.data.dataList = result.data.dataList.filter(item => !_.isEqual(friend, item))
        //         })
        //
        //         setTimeout(() => {
        //             dispatch(syncConversationList(result.data.dataList))
        //         }, 0)
        //         setConversationList(prevState => [...prevState, ...result.data.dataList])
        //     }
        // }).catch(err => {
        //     throw new Error(err)
        // })
        //
        // return () => {
        //     console.log('我取消了订阅')
        //     PubSub.unsubscribe(addToken)
        // }

    }, [conversationSequence, messageList])


    return (
        <StyledMessageList {...rest}>
            <FilterList
                options={["最新消息优先", "在线好友优先"]}
                actionLabel="创建会话"
            >
                <ChatList>
                    {conversationList.map((item, index) => (
                        <animated.div key={item.toId} style={trailAnimes[index]}>
                            <MessageCard
                                key={item.toId}
                                sign={item.toId}
                                active={item.toId === activeIndex}
                                replied={!item.message.isAccept}
                                avatarSrc={item.avatarSrc ? item.avatarSrc : face}
                                name={item.toId}
                                avatarStatus={item.status ? item.status : "online"}
                                statusText={item.statusText ? item.statusText : '在线'}
                                time={formatTime(item.message.messageTime)}
                                message={item.message.messageContent}
                                unreadCount={item.unreadCount}
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
