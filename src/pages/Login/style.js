import styled from "styled-components";

const StyledLogin = styled.div`
    
`;

const StyledContainer = styled.div`
    position: fixed;
    background-color: rgba(0, 0, 0, 0);
    width: 500px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
    padding: 20px;
    text-align: center;
`

const StyledLoginTitle = styled.div`
    text-align: center;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    color: white;
`

export default StyledLogin;

export {
    StyledContainer,
    StyledLoginTitle
}
