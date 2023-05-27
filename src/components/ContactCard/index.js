import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledContactCard, {Intro, Name, StyledBlack, StyledDelete} from "./style";
import face from "assets/images/face-male-2.jpg";
import Avatar from "components/Avatar";
import {useSdk} from "../../sdk/SdkContext";
import PubSub from "pubsub-js";
import {DeleteOutlined, MehOutlined, UserDeleteOutlined} from "@ant-design/icons";
import {Button, Popconfirm} from "antd";
import {useDispatch} from "react-redux";
import {removeFriend} from "../../store/festures/friend/friendListSlice";

function ContactCard({contact, children, ...rest}) {

    const im = useSdk()
    const [contactInfo, setContactInfo] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        im.getUserInfo([contact.toId]).then(result => {
            setContactInfo({...result.data.userDataItems[0]})
        }).catch(err => {
            throw new Error(err)
        })
    }, [contact.toId])

    const transformInfo = () => {
        PubSub.publish("friendModalInfo", contactInfo)
        PubSub.publish("close", false)
    }

    const deleteFriend = () => {
        im.deleteFriend(contact.toId)
        dispatch(removeFriend({userId: contact.toId}))
    }

    const blackFriend = () => {
        im.blackFriend(contact.toId)
        dispatch(removeFriend({userId: contact.toId}))
    }

    return (
        <StyledContactCard {...rest}>
            <Avatar src={contactInfo?.photo ? contactInfo.photo : face} status="online" onClick={transformInfo}/>
            <Name>{contact.remark ? contact.remark : contact.toId}</Name>
            <Intro>{contactInfo.selfSignature}</Intro>
            <StyledDelete>
                <Popconfirm
                    title="删除好友"
                    description="你确定要删除好友吗？"
                    onConfirm={deleteFriend}
                >
                    <Button danger icon={<UserDeleteOutlined/>}></Button>
                </Popconfirm>
            </StyledDelete>
            <StyledBlack>
                <Popconfirm
                    title="拉黑好友"
                    description="你确定要拉黑好友吗？"
                    onConfirm={blackFriend}
                >
                    <Button icon={<MehOutlined/>}></Button>
                </Popconfirm>
            </StyledBlack>
        </StyledContactCard>
    );
}

ContactCard.propTypes = {
    children: PropTypes.any,
};

export default ContactCard;
