import React from "react";
import PropTypes from "prop-types";
import StyledLogin from "./style";

function Login({children, ...rest}) {
    return (
        <StyledLogin {...rest}>
            {children}
        </StyledLogin>
    );
}

Login.propTypes = {
    children: PropTypes.any
};

export default Login;
