import styled, {css} from "styled-components";
import Paragraph from "../Paragraph";

const Time = styled(Paragraph).attrs({type: "secondary", size: "small"})`
    margin: 6px;
    margin-left: 24px;
    word-spacing: 1rem;
`;

const Bubble = styled.div`
    width: 200px;
    height: 250px;
    //padding: 15px 22px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    position: relative;
    z-index: 10;
    overflow: hidden;
`;

const typeVariants = {
    mine: css`
        ${Bubble} {
            background-color: ${({theme}) => theme.primaryColor};
        }

        ${Time} {
            text-align: right;
            margin-left: 0;
            margin-right: 24px;
        }
    `,
};

const StyledImageChatBubble = styled.div`
    display: flex;
    flex-direction: column;

    ${({type}) => type && typeVariants[type]}
`;

export default StyledImageChatBubble;
export {Bubble, Time}
