import React from "react";
import PropTypes from "prop-types";
import StyledFriendModal, {StyledFriendButton} from "./style";
import Avatar from "../Avatar";
import Text from "../Text"
import face from "assets/images/face-male-2.jpg";
import {Button, Tooltip} from "antd";
import {MessageTwoTone, PhoneTwoTone, VideoCameraTwoTone} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import PubSub from "pubsub-js";


function FriendModal({children, ...rest}) {

    const {friendModalInfo} = {...rest}

    const navigate = useNavigate()

    const navigateToMessage = () => {
        PubSub.publish('addConversation', friendModalInfo)
        navigate('/', {
            replace: true
        })
    }

    return (
        <StyledFriendModal {...rest}>
            <Avatar
                src={friendModalInfo?.photo ? friendModalInfo.photo : face}
                size={"150px"}
                status={"online"}
                statusIconSize={"12px"}
            />
            <Text size={"xxlarge"}>{friendModalInfo?.userId}</Text>
            <StyledFriendButton>
                <Tooltip title="phone">
                    <Button shape="circle" size={"large"}
                            icon={<PhoneTwoTone style={{fontSize: "28px", color: "#4F9DDE"}}
                                                twoToneColor={"#4F9DDE"}/>}/>
                </Tooltip>
                <Tooltip title="video">
                    <Button shape="circle" size={"large"}
                            icon={<VideoCameraTwoTone style={{fontSize: "28px", color: "#4F9DDE"}}
                                                      twoToneColor={"#4F9DDE"}/>}/>
                </Tooltip>
                <Tooltip title="message">
                    <Button shape="circle" size={"large"}
                            icon={<MessageTwoTone style={{fontSize: "28px", color: "#4F9DDE"}}
                                                  twoToneColor={"#4F9DDE"}/>}
                            onClick={navigateToMessage}
                    />
                </Tooltip>
            </StyledFriendButton>
        </StyledFriendModal>
    );
}

FriendModal.propTypes = {
    children: PropTypes.any
};

export default FriendModal;
