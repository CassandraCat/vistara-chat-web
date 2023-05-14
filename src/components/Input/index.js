import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledInput, {InputContainer, Prefix, Suffix} from "./style";
import Icon from "components/Icon";
import {ReactComponent as SearchIcon} from "assets/icons/search.svg";
import {useTheme} from "styled-components";
import InputText from "./InputText";
import {useDispatch, useSelector} from "react-redux";
import {modifyMessageContent} from "../../store/festures/message/messageContentSlice";
import AliYunOSSUpload from "../AliYunOSSUpload";


function Input({placeholder = "请输入内容...", prefix, suffix, ...rest}) {

    const dispatch = useDispatch()
    const messageContent = useSelector(state => state.messageContent)

    const msgHandler = (e) => {
        dispatch(modifyMessageContent(e.target.value))
    }

    return (
        <InputContainer {...rest}>
            {prefix && (
                <Prefix>
                    <AliYunOSSUpload>
                        {prefix}
                    </AliYunOSSUpload>
                </Prefix>
            )}
            <StyledInput onChange={msgHandler}
                         value={messageContent}
                         placeholder={placeholder}/>
            {suffix && <Suffix>{suffix}</Suffix>}
        </InputContainer>
    );
}

function Search({placeholder = "请输入搜索内容...", ...rest}) {
    const theme = useTheme();
    return (
        // <Input
        //     placeholder={placeholder}
        //     prefix={
        //         <Icon icon={SearchIcon} color={theme.gray3} width={18} height={18}/>
        //     }
        //     {...rest}
        // />
        <InputContainer {...rest}>
            <Prefix>
                <Icon icon={SearchIcon} color={theme.gray3} width={18} height={18}/>
            </Prefix>
            <StyledInput placeholder={placeholder}/>
        </InputContainer>
    );
}

Input.Search = Search;
Input.Text = InputText;

Input.propTypes = {
    placeholder: PropTypes.string,
    prefix: PropTypes.any,
    suffix: PropTypes.any,
};

export default Input;
