import styled from "styled-components";
import Paragraph from "components/Paragraph";
import {card} from "utils/mixins";
import StyledAvatar from "components/Avatar/style";

const Name = styled(Paragraph).attrs({size: "large"})`
    grid-area: name;
`;

const Intro = styled(Paragraph).attrs({type: "secondary"})`
    grid-area: intro;
`;

const StyledContactCard = styled.div`
    position: relative;
    ${card()}
    display: grid;
    grid-template-areas:
    "avatar name"
    "avatar intro";
    grid-template-columns: 62px auto;

    ${StyledAvatar} {
        grid-area: avatar;
    }
`;

const StyledDelete = styled.div`
    position: absolute;
    right: 15px;
    top: 10px;
`

const StyledBlack = styled.div`
    position: absolute;
    right: 15px;
    top: 50px;
`

export default StyledContactCard;
export {Name, Intro, StyledDelete, StyledBlack};
