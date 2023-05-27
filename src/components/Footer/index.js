import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import StyledFooter, {IconContainer, StyledPopoverContent, VoiceContainer} from "./style";

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
import {faKeyboard} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import OSS from "ali-oss"
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

let client = null;

function Footer({animeProps, style, children, ...rest}) {

    const im = useSdk()

    const [emojiIconActive, setEmojiIconActive] = useState(false);
    const [voidActive, setVoiceActive] = useState(true);
    const theme = useTheme();
    const messageContent = useSelector(state => state.messageContent)
    const friendInfo = useSelector(state => state.friendInfo)

    const dispatch = useDispatch()

    const [recording, setRecording] = useState(false)
    const [audioData, setAudioData] = useState(null)
    let timer;

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const getToken = async () => {
        // 设置客户端请求访问凭证的地址。
        await axios.get("http://localhost:3001/sts").then((token) => {
            client = new OSS({
                // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
                region: 'oss-cn-hangzhou',
                accessKeyId: token.data.AccessKeyId,
                accessKeySecret: token.data.AccessKeySecret,
                stsToken: token.data.SecurityToken,
                // 填写Bucket名称。
                bucket: "vistara",
                // 刷新临时访问凭证。
                refreshSTSToken: async () => {
                    const refreshToken = await axios.get("http://localhost:3001/sts");
                    return {
                        accessKeyId: refreshToken.AccessKeyId,
                        accessKeySecret: refreshToken.AccessKeySecret,
                        stsToken: refreshToken.SecurityToken,
                    };
                },
            });
        });
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                chunksRef.current = [];
                mediaRecorderRef.current = new MediaRecorder(stream);

                mediaRecorderRef.current.addEventListener('dataavailable', e => {
                    chunksRef.current.push(e.data);
                });

                mediaRecorderRef.current.addEventListener('stop', () => {
                    const audioBlob = new Blob(chunksRef.current, {type: 'audio/webm'});
                    getToken().then(() => {
                        // 使用临时访问凭证上传文件。
                        // 填写不包含Bucket名称在内的Object的完整路径，例如exampleobject.jpg。
                        // 填写本地文件的完整路径，例如D:\\example.jpg。
                        const uuid = uuidv4()
                        const fileName = `${uuid}.webm`; // 自定义文件名，根据需求进行修改
                        const folder = 'im-data'; // OSS 中的文件夹路径，根据需求进行修改
                        client.put(`${folder}/${fileName}`, audioBlob)
                            .then((result) => {
                                console.log('音频上传成功：', result);
                                // 处理上传成功的逻辑...
                                const pack = im.sendP2PAudioMessage(friendInfo.userId, result.url)
                                const messageBody = JSON.parse(pack.messageBody)
                                const messageInfo = {
                                    isAccept: false,
                                    type: 3,
                                    messageContent: messageBody.content,
                                    messageId: pack.messageId,
                                    messageKey: pack.messageKey || '',
                                    messageTime: pack.messageTime
                                }
                                dispatch(modifyMessageList({
                                    friendId: pack.toId,
                                    messageInfo
                                }))
                                dispatch(syncConversationList([{
                                    toId: pack.toId,
                                    message: messageInfo
                                }]))
                            })
                            .catch((error) => {
                                console.error('音频上传失败：', error);
                                // 处理上传失败的逻辑...
                            });
                    })
                    // Read audioBlob using FileReader
                    const reader = new FileReader();
                    reader.onload = () => {
                        const audioArrayBuffer = reader.result
                        setAudioData(audioArrayBuffer)
                    };
                    reader.readAsArrayBuffer(audioBlob);

                    chunksRef.current = [];
                });

                mediaRecorderRef.current.start();
                setRecording(true);
                timer = setTimeout(stopRecording, 120000); // 设置最长录制时间（例如120秒）
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            clearTimeout(timer);
            setRecording(false);
        }
    };

    const sendMessage = () => {
        const pack = im.sendP2PTextMessage(friendInfo.userId, messageContent)
        const messageBody = JSON.parse(pack.messageBody)
        const messageInfo = {
            isAccept: false,
            type: 1,
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
            message: messageInfo
        }]))
    }

    const changeToVoice = () => {
        setVoiceActive(true)
    }

    const changeToText = () => {
        setVoiceActive(false)
    }

    const mouseDownHandler = () => {
        startRecording()
    }

    const mouseUpHandler = () => {
        stopRecording()
    }

    return (
        <StyledFooter style={{...style, ...animeProps}} {...rest}>
            {
                !voidActive && (
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
                                <Icon icon={MicrophoneIcon} onClick={changeToVoice}/>
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
                )
            }
            {
                voidActive && (
                    <VoiceContainer>
                        <FontAwesomeIcon icon={faKeyboard} style={{fontSize: "36px", color: 'skyblue'}}
                                         onClick={changeToText}/>
                        <Button shape={'rect'} size={'90%'} onMouseDown={mouseDownHandler}
                                onMouseUp={mouseUpHandler}>按住说话</Button>
                    </VoiceContainer>
                )
            }
        </StyledFooter>
    );
}

/* eslint-disable jsx-a11y/accessible-emoji */
function PopoverContent(props) {

    const messageContent = useSelector(state => state.messageContent)
    const dispatch = useDispatch()

    const selectEmoji = (e) => {
        // console.log(e.target.innerHTML)
        dispatch(modifyMessageContent(messageContent + e.target.innerHTML))
    }

    return (
        <StyledPopoverContent onClick={selectEmoji}>
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
