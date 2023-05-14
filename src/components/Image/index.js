import React from "react";
import PropTypes from "prop-types";
import StyledImage, {MsgImage} from "./style";

function Image({children, src, size = {width: '200px', height: '250px'}, ...rest}) {
    return (
        <StyledImage size={size} {...rest}>
            <MsgImage src={src}></MsgImage>
        </StyledImage>
    );
}

Image.propTypes = {
    children: PropTypes.any,
    src: PropTypes.object,
    size: PropTypes.string
};

export default Image;

