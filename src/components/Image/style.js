import styled from "styled-components";

const StyledImage = styled.div`
    width: ${({size}) => size.width};
     height: ${({size}) => size.height};
    overflow: hidden;
`;

const MsgImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
`

export default StyledImage;

export {MsgImage}
