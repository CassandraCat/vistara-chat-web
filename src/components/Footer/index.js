import React, {useState} from "react";
import PropTypes from "prop-types";
import StyledFooter, {IconContainer, StyledPopoverContent} from "./style";

import {ReactComponent as ClipIcon} from "assets/icons/clip.svg";
import {ReactComponent as SmileIcon} from "assets/icons/smile.svg";
import {ReactComponent as MicrophoneIcon} from "assets/icons/microphone.svg";
import {ReactComponent as PlaneIcon} from "assets/icons/plane.svg";
import {ReactComponent as OptionsIcon} from "assets/icons/options.svg";
import Input from "components/Input";
import Icon from "components/Icon";
import Button from "components/Button";
import Emoji from "components/Emoji";
import Popover from "components/Popover";
import {useTheme} from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useSdk} from "../../sdk/SdkContext";
import {modifyMessageList} from "../../store/festures/message/messageSlice";
import {modifyMessageContent} from "../../store/festures/message/messageContentSlice";
import {syncConversationList} from "../../store/festures/conversation/conversationListSlice";

function Footer({animeProps, style, children, ...rest}) {

    const im = useSdk()

    const [emojiIconActive, setEmojiIconActive] = useState(false);
    const theme = useTheme();
    const messageContent = useSelector(state => state.messageContent)
    const friendInfo = useSelector(state => state.friendInfo)

    const dispatch = useDispatch()

    const sendMessage = () => {
        const pack = im.sendP2PTextMessage(friendInfo.userId, messageContent)
        const messageBody = JSON.parse(pack.messageBody)
        const messageInfo = {
            isAccept: false,
            messageContent: messageBody.content,
            messageId: pack.messageId,
            messageKey: pack.messageKey || '',
            messageTime: pack.messageTime
        }
        dispatch(modifyMessageList({
            friendId: pack.toId,
            messageInfo
        }))
        dispatch(modifyMessageContent(''))
        dispatch(syncConversationList([{
            toId: pack.toId,
            messsage: messageInfo
        }]))
    }

    return (
        <StyledFooter style={{...style, ...animeProps}} {...rest}>
            <Input
                placeholder="输入想和对方说的话"
                prefix={<Icon icon={ClipIcon}/>}
                suffix={
                    <IconContainer>
                        <Popover
                            content={<PopoverContent/>}
                            offset={{x: "-25%"}}
                            onVisible={() => setEmojiIconActive(true)}
                            onHide={() => setEmojiIconActive(false)}
                        >
                            <Icon
                                icon={SmileIcon}
                                color={emojiIconActive ? undefined : theme.gray3}
                            />
                        </Popover>
                        <Icon icon={MicrophoneIcon}/>
                        <Button size="52px" onClick={sendMessage}>
                            <Icon
                                icon={PlaneIcon}
                                color="white"
                                style={{transform: "translateX(-2px)"}}
                            />
                        </Button>
                    </IconContainer>
                }
            />
        </StyledFooter>
    );
}

/* eslint-disable jsx-a11y/accessible-emoji */
function PopoverContent(props) {
    return (
        <StyledPopoverContent>
            <Emoji label="smile">😊</Emoji>
            <Emoji label="grinning">😆</Emoji>
            <Emoji label="thumbup">👍</Emoji>
            <Emoji label="indexfingerup">☝️</Emoji>
            <Emoji label="ok">👌</Emoji>
            <Emoji label="handsputtogether">🙏</Emoji>
            <Emoji label="smilewithsunglasses">😎</Emoji>
            <Emoji label="flexedbicep">💪</Emoji>
            <Icon icon={OptionsIcon} style={{marginLeft: "24px"}}/>
        </StyledPopoverContent>
    );
}

Footer.propTypes = {
    children: PropTypes.any,
};

export default Footer;
