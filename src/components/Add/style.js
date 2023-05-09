import styled from "styled-components";

const StyledAdd = styled.div`
    width: 800px;
    margin: 120px auto;

    & > .anticon-close-circle {
        position: absolute;
        top: 30px;
        left: 30px;
    }

    & .ant-input-search-button {
        background-color: ${({theme}) => theme.primaryColor};
    }
`;

export default StyledAdd;
