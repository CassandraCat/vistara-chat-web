import React, {useEffect} from "react";
import PropTypes from "prop-types";
import StyledTitleBar, {Actions, Title} from "./style";

import face from "assets/images/face-male-2.jpg";

import {ReactComponent as Call} from "assets/icons/call.svg";
import {ReactComponent as Camera} from "assets/icons/camera.svg";
import {ReactComponent as Options} from "assets/icons/options.svg";
import Avatar from "components/Avatar";
import Paragraph from "components/Paragraph";
import Text from "components/Text";
import Icon from "components/Icon";
import {DropdownItem} from "components/Dropdown/style";
import Dropdown from "components/Dropdown";
import Seperator from "components/Seperator";

function TitleBar({
                      animeProps,
                      style,
                      onAvatarClick,
                      onVideoClicked,
                      children,
                      ...rest
                  }) {

    const {toinfo} = {...rest}

    return (
        <StyledTitleBar style={{...style, ...animeProps}} {...rest}>
            <Avatar onClick={onAvatarClick} status="online" src={face}/>
            <Title>
                <Paragraph size="large">{toinfo?.userId}</Paragraph>
                <Paragraph type="secondary">
                    <Text>在线</Text>
                    <Text>· 最后阅读：3小时前</Text>
                </Paragraph>
            </Title>
            <Actions>
                <Icon opacity={0.3} icon={Call} onClick={onVideoClicked}/>
                <Icon opacity={0.3} icon={Camera}/>
                <Dropdown
                    content={
                        <>
                            <DropdownItem>
                                <Paragraph>个人资料</Paragraph>
                            </DropdownItem>
                            <DropdownItem>
                                <Paragraph>关闭会话</Paragraph>
                            </DropdownItem>
                            <Seperator/>
                            <DropdownItem>
                                <Paragraph type="danger">屏蔽此人</Paragraph>
                            </DropdownItem>
                        </>
                    }
                >
                    <Icon opacity={0.3} icon={Options}/>
                </Dropdown>
            </Actions>
        </StyledTitleBar>
    );
}

TitleBar.propTypes = {
    children: PropTypes.any,
};

export default TitleBar;
