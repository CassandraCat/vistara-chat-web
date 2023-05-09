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

function MessageList({children, ...rest}) {
    const trailAnimes = useStaggeredList(6);

    const im = useSdk()

    const [activeIndex, setActiveIndex] = useState(0)
    const [conversationList, setConversationList] = useState([])

    const changeHandler = (index) => {
        setActiveIndex(index)
        PubSub.publish("showMessage", true)
    }

    useEffect(() => {

    }, [])


    return (
        <StyledMessageList {...rest}>
            <FilterList
                options={["最新消息优先", "在线好友优先"]}
                actionLabel="创建会话"
            >
                <ChatList>
                    {messageData.map((message, index) => (
                        <animated.div key={message.id} style={trailAnimes[index]}>
                            <MessageCard
                                key={message.id}
                                sign={message.id}
                                active={message.id === activeIndex}
                                replied={message.replied}
                                avatarSrc={message.avatarSrc}
                                name={message.name}
                                avatarStatus={message.status}
                                statusText={message.statusText}
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
