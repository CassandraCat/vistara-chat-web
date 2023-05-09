import styled from "styled-components";

const StyledFriendModal = styled.div`
    margin: 150px auto;
    text-align: center;
    & div {
        width: 150px;
        margin: 20px auto;
    }
   
`;

const StyledFriendButton = styled.div`
    margin: 20px auto !important;
    display: flex;
    justify-content: space-around;
    width: 250px !important; 
    
    & > button {
        min-width: 70px!important;
        min-height: 70px;
    }
    
`

export default StyledFriendModal;

export {StyledFriendButton}
