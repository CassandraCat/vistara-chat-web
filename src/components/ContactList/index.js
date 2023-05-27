import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledContactList, {Contacts, StyledText} from "./style";
import FilterList from "components/FilterList";
import ContactCard from "components/ContactCard";
import useStaggeredList from "hooks/useStaggeredList";
import Text from "components/Text";
import {animated} from "react-spring";
import _ from "lodash"
import {useSdk} from "../../sdk/SdkContext";
import PubSub from "pubsub-js";
import {useDispatch, useSelector} from "react-redux";
import {syncFriendList} from "../../store/festures/friend/friendListSlice";

function ContactList({children, ...rest}) {

    console.log('我重新渲染了!!!!!!!!')

    const trailAnimes = useStaggeredList(10);

    const friendList = useSelector(state => state.friendList)

    const [contacts, setContacts] = useState(friendList)

    const im = useSdk()

    let friendSequence = window.localStorage.getItem("friendSequence")

    const dispatch = useDispatch()


    useEffect(() => {

        const addFriendToken = PubSub.subscribe("addFriend", (_, data) => {
            setContacts(prevState => {
                prevState.forEach(item => {
                    if (item.toId === data.toId) {
                        return prevState
                    }
                })
                return [...prevState, data]
            })
        })

        if (friendSequence === null) {
            friendSequence = 0
            window.localStorage.setItem("friendSequence", friendSequence)
        }
        im.syncFriendshipList(friendSequence, 100).then((result) => {
            if (result.data.maxSequence != null) {
                friendSequence = result.data.maxSequence
                window.localStorage.setItem("friendSequence", friendSequence)
            }
            if (result.data.dataList?.length > 1) {
                friendList.forEach(friend => {
                    result.data.dataList = result.data.dataList.filter(item => !_.isEqual(friend, item))
                })
                result.data.dataList = result.data.dataList.filter(item => item.status !== 2)
                dispatch(syncFriendList(result.data.dataList))
                setContacts(prevState => [...prevState, ...result.data.dataList])
            } else if (result.data.dataList?.length === 1) {
                setContacts(prevState => {
                    return prevState.filter(item => item.toId !== result.data.dataList[0].toId)
                })
            }
        }).catch((error) => {
            throw new Error(error)
        })

        return () => {
            PubSub.unsubscribe(addFriendToken)
        }

    }, [friendSequence, friendList])

    return (
        <StyledContactList {...rest}>
            <FilterList options={["新添加优先", "按姓名排序"]} actionLabel="添加好友">
                <Contacts>
                    {contacts?.map((contact, i) => (
                        <animated.div key={contact.toId} style={trailAnimes[i]}>
                            <ContactCard key={contact.toId} contact={contact}/>
                        </animated.div>
                    ))}
                </Contacts>
                <StyledText>
                    {
                        !contacts && <Text type={"secondary"} size={"xlarge"}>你还没有添加过好友</Text>
                    }
                </StyledText>
            </FilterList>
        </StyledContactList>
    );
}

ContactList.propTypes = {
    children: PropTypes.any,
};

export default React.memo(ContactList);
