import styled from "styled-components";
import Button from "components/Button";
import Avatar from "components/Avatar";
import {card} from "utils/mixins";

const Actions = styled.div`
    grid-area: actions / title;
    align-self: end;
    justify-self: center;
    align-items: center;
    justify-items: center;

    display: grid;
    grid-template-areas: "left center right";
    grid-template-columns: 90px 90px 90px;
`;

const Action = styled(Button).attrs({size: "64px"})`
    position: relative;
    z-index: 1000;
    font-size: 32px;
    color: white;

    box-shadow: none;
    background: ${({theme, type}) =>
            type === "hangoff" ? theme.red2 :
                    type === "accept" ? theme.green : theme.grayDark2};
    grid-area: ${({type}) => type === 'accept' ? "right" : ""};
`;

const Self = styled(Avatar)`
    grid-area: self;
    align-self: end;
    justify-self: end;
`;

const Minimize = styled(Button)`
    position: relative;
    z-index: 1000;
    justify-self: end;
    grid-area: title;
    background-color: ${({theme}) => theme.gray3};
    padding: 0;
    width: 62px;
    height: 62px;
    font-size: 46px;
`;

const VideoCallAlert = styled.div`
    display: grid;
    grid-template-areas:
    "avatar info info"
    "avatar action icon";
    row-gap: 5px;
    column-gap: 10px;
    align-items: center;
    width: max-content;
    position: absolute;
    right: 0;
    top: 10vh;
    border: 1px solid ${({theme}) => theme.gray4};
    z-index: 200;
    ${card}
`;

const StyledVideoCall = styled.div`
    height: 100%;
    padding: 20px;
    padding-bottom: 40px;
    background-image: url(${({src}) => src});
    background-size: cover;
    background-position: center;

    display: grid;
    grid-template-areas:
    "title title"
    "actions self";
`;

const StyledVideos = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 1244px;
    height: 100vh;
`

const RemoteVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit:fill
`
const LocalVideo = styled.video`
    position: absolute; 
    top: 0;
    left: 0;
    width: 400px;
    height: 400px;
    z-index: 100;
    object-fit:fill
`

export default StyledVideoCall;
export {Actions, Action, Self, Minimize, StyledVideoCall, VideoCallAlert, StyledVideos, LocalVideo, RemoteVideo};
