import React from "react";
import PropTypes from "prop-types";
import StyledLogin, {StyledContainer, StyledLoginTitle} from "./style";
import {useAuth} from "guard/AuthProvider";
import {Button, Form, Input, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import Particles from "react-tsparticles";
import {loadFull} from "tsparticles";
import {useUserLoginMutation} from "../../store/festures/api/userApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {modify, modifyUserSession} from "../../store/festures/user/userSessionSlice";
import {useSdk} from "../../sdk/SdkContext";
import {modifyUserInfo} from "../../store/festures/user/userInfoSlice";

function Login({children, ...rest}) {

    const [userLogin] = useUserLoginMutation()
    const {login} = useAuth()
    const userSession = useSelector(state => state.userSession)
    const dispatch = useDispatch()
    const im = useSdk()

    const ListenerMap = {
        onSocketConnectEvent: (option, status, data) => {
            console.log("已建立连接:" + JSON.stringify(status));
        },
        onSocketErrorEvent: (error) => {
            console.log("连接出现错误:");
        },
        onSocketReConnectEvent: () => {
            console.log("正在重连:");
        },
        onSocketCloseEvent: () => {
            console.log("连接关闭:");
        }, onSocketReConnectSuccessEvent: () => {
            console.log("重连成功");
        },
        onLogin: (uid) => {
            console.log("用户" + uid + "登陆sdk成功");
        },
        onP2PMessage: (e) => {
            // 收到的单聊消息
        },
        onGroupMessage: (e) => {
            // 收到的群聊消息
        },
        onMessageAck: (e) => {
            // 单聊消息发送成功ACK
        },
        onMessageReceiveAck: (e) => {
            // 消息接收ACK
        },
        onMessageReadedNotify: (e) => {
            // 消息已读通知发送给同步端
        },
        onMessageReadedReceipt: (e) => {
            // 消息已读回执
        },
        onMessageRecallNotify: (e) => {
            // 消息撤回通知
        },
        onMessageRecallAck: (e) => {
            // 消息撤回ACK
        },
        onAddFriend: (e) => {
            // 添加好友通知
        },
        onUpdateFriend: (e) => {
            // 更新好友通知
        },
        onDeleteFriend: (e) => {
            // 删除好友通知
        },
        onFriendRequest: (e) => {
            // 好友申请通知
        },
        onReadFriendRequest: (e) => {
            // 好友申请已读通知
        },
        onApproveFriendRequest: (e) => {
            // 审批好友申请通知
        },
        onBlackFriend: (e) => {
            // 拉黑好友通知
        },
        onDeleteBlackFriend: (e) => {
            // 删除拉黑好友通知
        },
        onAddFriendGroup: (e) => {
            // 添加好友分组通知
        },
        onDeleteFriendGroup: (e) => {
            // 删除好友分组通知
        },
        onAddFriendGroupMember: (e) => {
            // 添加好友分组成员通知
        },
        onDeleteFriendGroupMember: (e) => {
            // 删除好友分组成员通知
        },
        onDeleteAllFriend: (e) => {
            // 删除所有好友通知
        },
        onJoinGroup: (e) => {
            // 申请入群通知
        },
        onAddGroupMember: (e) => {
            // 添加群成员通知
        },
        onCreateGroup: (e) => {
            // 创建群组通知
        },
        onUpdateGroup: (e) => {
            // 更新群组通知
        },
        onExitGroup: (e) => {
            // 退出群组通知
        },
        onUpdateGroupMember: (e) => {
            // 修改群成员通知
        },
        onDeleteGroupMember: (e) => {
            // 删除群成员通知
        },
        onDestroyGroup: (e) => {
            // 解散群通知
        },
        onTransferGroup: (e) => {
            // 转让群通知
        },
        onMuteGroup: (e) => {
            // 禁言群通知
        },
        onMuteGroupMember: (e) => {
            // 禁言群成员通知
        },
        onApproveGroupRequest: (e) => {
            // 审批群申请通知
        },
        onReadGroupRequest: (e) => {
            // 已读群申请通知
        },
        onGroupMessageReadedNotify: (e) => {
            // 群聊消息已读通知
        },
        onGroupMessageReadedReceipt: (e) => {
            // 群聊消息已读回执
        },
        onGroupMessageAck: (e) => {
            // 群聊消息ACK
        },
        onUserModify: (e) => {
            // 用户信息变更通知
        },
        onUserOnlineStatusChangeNotify: (e) => {
            // 用户在线状态更改通知
        },
        onUserOnlineStatusChangeNotifySync: (e) => {
            // 用户在线状态更改同步通知
        },
        onUserCustomStatusChangeNotify: (e) => {
            // 用户自身在线状态更改通知
        },
        onConversationDelete: (e) => {
            // 删除会话通知
        },
        onConversationUpdate: (e) => {
            // 更新会话通知
        }
    }

    const onFinish = value => {
        const userAccountInfo = {
            userName: value.username,
            password: value.password,
            loginType: 1
        }
        userLogin(userAccountInfo).then((result) => {
            const data = result.data
            if (data.code === 200) {
                const listeners = {...ListenerMap}
                im.init(data.data.appId, data.data.userId, data.data.imUserSign, listeners, (sdk) => {
                    if (sdk) {
                        console.log('sdk 成功连接的回调, 可以使用 sdk 请求数据了...');
                        sdk.getSingleUserInfo().then((result) => {
                            dispatch(modifyUserInfo(result.data))
                        }).catch((error) => {
                            throw new Error(error)
                        })
                        login(data.data)
                        dispatch(modifyUserSession(data.data))
                    } else {
                        console.log('sdk 初始化失败...');
                    }
                })
            } else {
                message.error('用户名或密码错误')
            }
        }).catch((error) => {
            throw new Error(error)
        })
    }

    const particlesInit = async (main) => {

        await loadFull(main);
    };

    const particlesLoaded = (container) => {
    };

    const options = {
        background: {
            color: {
                value: "#0d47a1",
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 6,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: {min: 1, max: 5},
            },
        },
        detectRetina: true,
    }

    return (
        <StyledLogin {...rest}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={options}
            />
            <StyledContainer>
                <StyledLoginTitle>Vistara Chat</StyledLoginTitle>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your Username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your Password!'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </StyledContainer>
        </StyledLogin>
    );
}

Login.propTypes = {
    children: PropTypes.any
};

export default Login;
