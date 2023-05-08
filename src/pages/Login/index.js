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
        onTestMessage: (e) => {
            console.log("onTestMessage ：" + e);
        },
        onLogin: (uid) => {
            console.log("用户" + uid + "登陆sdk成功");
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
