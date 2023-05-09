import React from "react";
import PropTypes from "prop-types";
import StyledFriendModal, {StyledFriendButton} from "./style";
import Avatar from "../Avatar";
import Text from "../Text"
import face from "assets/images/face-female-2.jpg";
import {Button, Tooltip} from "antd";
import {MessageTwoTone, PhoneTwoTone, VideoCameraTwoTone} from "@ant-design/icons";


function FriendModal({children, ...rest}) {

    const {friendModalInfo} = {...rest}


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
                                                  twoToneColor={"#4F9DDE"}/>}/>
                </Tooltip>
            </StyledFriendButton>
        </StyledFriendModal>
    );
}

FriendModal.propTypes = {
    children: PropTypes.any
};

export default FriendModal;
