import React from "react";
import PropTypes from "prop-types";
import StyledLogin, {StyledContainer, StyledLoginTitle} from "./style";
import {useAuth} from "guard/AuthProvider";
import {Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import Particles from "react-tsparticles";
import {loadFull} from "tsparticles";

function Login({children, ...rest}) {


    const {login} = useAuth()


    const onFinish = () => {

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
