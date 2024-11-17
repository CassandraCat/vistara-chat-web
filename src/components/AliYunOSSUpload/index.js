import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import moment from "moment/moment";
import Base64 from "base-64";
import CryptoJS from "crypto-js";
import {message, Upload} from "antd";
import {useSdk} from "../../sdk/SdkContext";
import {useDispatch, useSelector} from "react-redux";
import {modifyMessageList} from "../../store/festures/message/messageSlice";
import {syncConversationList} from "../../store/festures/conversation/conversationListSlice";

function AliYunOSSUpload({value, onChange, children}) {

    const im = useSdk()
    const friendInfo = useSelector(state => state.friendInfo)
    const dispatch = useDispatch()

    const [fileList, setFileList] = useState([])

    const [OSSData, setOSSData] = useState();

    const todayKey = moment().format('YYYY-MM-DD')
    const host = "https://vistara.oss-accelerate.aliyuncs.com"
    const accessId = ""
    const accessSecret = ""
    const policyText = {
        "expiration": "2028-01-01T12:00:00.000Z", // 设置该Policy的失效时间，
        "conditions": [
            ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
        ]
    }

    const policy = Base64.encode(JSON.stringify(policyText))
    const bytes = CryptoJS.HmacSHA1(policy, accessSecret, {asBytes: true})
    const signature = bytes.toString(CryptoJS.enc.Base64)

    const mockGetOSSData = () => ({
        dir: 'im-data/',
        expire: new Date(policyText.expiration).getTime(),
        host,
        accessId,
        policy,
        signature,
    })

    const init = async () => {
        try {
            const result = await mockGetOSSData()
            setOSSData(result)
        } catch (error) {
            message.error(error)
        }
    }

    useEffect(() => {
        init()
    }, [])

    const handleChange = ({fileList}) => {
        console.log('AliYun OSS:', fileList)
        fileList.forEach(file => {
            if (file.status === 'uploading') {
                console.log(`${file.name} is uploading`)
            } else if (file.status === 'done') {
                const fileInfo = {
                    name: file.name,
                    uid: file.uid,
                    url: OSSData.host + '/' + file.url,
                    type: file.type
                }
                setFileList(prevState => [...prevState, {...fileInfo}])
                if (file.type.includes('image')) {
                    const pack = im.sendP2PImageMessage(friendInfo.userId, fileInfo.url)
                    const messageBody = JSON.parse(pack.messageBody)
                    const messageInfo = {
                        isAccept: false,
                        type: 2,
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
                } else if (file.type.includes('video')) {
                    const pack = im.sendP2PVideoMessage(friendInfo.userId, fileInfo.url)
                    const messageBody = JSON.parse(pack.messageBody)
                    const messageInfo = {
                        isAccept: false,
                        type: 4,
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
                }
            } else {
                message.error(`${file.name} is upload failed`)
            }
        })
        onChange?.([...fileList])
    }

    const onRemove = (file) => {
        const files = (value || []).filter((v) => v.url !== file.url)
        if (onChange) {
            onChange(files)
        }
    }

    const getExtraData = (file) => ({
        key: file.url,
        OSSAccessKeyId: OSSData?.accessId,
        policy: OSSData?.policy,
        Signature: OSSData?.signature,
    })

    const beforeUpload = async (file) => {
        if (!OSSData) return false
        const expire = Number(OSSData.expire) * 1000
        if (expire < Date.now()) {
            await init()
        }
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix
        // @ts-ignore
        file.url = OSSData.dir + filename
        return file
    }

    const uploadProps = {
        name: 'file',
        fileList: value,
        action: OSSData?.host,
        onChange: handleChange,
        onRemove,
        data: getExtraData,
        beforeUpload,
        showUploadList: false
    }

    return (
        <div key={Math.random()}>
            <Upload {...uploadProps}>
                {children}
            </Upload>
        </div>
    );
}

AliYunOSSUpload.propTypes = {
    children: PropTypes.any
};

export default AliYunOSSUpload;
