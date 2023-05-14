import React from "react";
import PropTypes from "prop-types";
import StyledImageChatBubble, {Bubble, Time} from "./style";

function ImageChatBubble({children, type, time, ...rest}) {
    return (
        <StyledImageChatBubble type={type} {...rest}>
            <Bubble>
                {children}
            </Bubble>
            <Time>{time}</Time>
        </StyledImageChatBubble>
    );
}

ImageChatBubble.propTypes = {
    children: PropTypes.any,
    type: PropTypes.oneOf(["mine"]),
    time: PropTypes.string
};

export default ImageChatBubble;
