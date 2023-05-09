import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledContactList, {Contacts, StyledText} from "./style";
import FilterList from "components/FilterList";
import ContactCard from "components/ContactCard";
import useStaggeredList from "hooks/useStaggeredList";
import Text from "components/Text";
import {animated} from "react-spring";

import contactsData from "data/contacts";
import {useSdk} from "../../sdk/SdkContext";
import PubSub from "pubsub-js";

function ContactList({children, ...rest}) {
    const trailAnimes = useStaggeredList(10);

    const [contacts, setContacts] = useState([])

    const im = useSdk()

    let friendSequence = window.localStorage.getItem("friendSequence")

    useEffect(() => {
        PubSub.subscribe("addFriend", (_, data) => {
            setContacts(prevState => [...prevState, data])
        })
        if (friendSequence === null) {
            friendSequence = 0
            window.localStorage.setItem("friendSequence", friendSequence)
        }
        im.syncFriendshipList(friendSequence, 100).then((result) => {
            setContacts(result.data.dataList)
            window.localStorage.setItem("friendSequence",result.data.maxSequence)
        }).catch((error) => {
            throw new Error(error)
        })
    }, [])

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

export default ContactList;
