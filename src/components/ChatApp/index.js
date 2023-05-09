import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledChatApp, {Nav, Sidebar, Drawer, Content} from "./style";
import NavBar from "components/NavBar";
import MessageList from "components/MessageList";
import Conversation from "components/Conversation";
import Profile from "components/Profile";
import {matchPath, Navigate, Route, Routes, useLocation, useMatch} from "react-router-dom";
import ContactList from "components/ContactList";
import FileList from "components/FileList";
import NoteList from "components/NoteList";
import EditProfile from "components/EditProfile";
import Settings from "components/Settings";
import BlockedList from "components/BlockedList";
import VideoCall from "components/VideoCall";
import {useTransition, animated} from "react-spring";
import {useAuth} from "../../guard/AuthProvider";
import PubSub from "pubsub-js"
import Add from "../Add";
import FriendModal from "../FriendModal";

function ChatApp({children, ...rest}) {

    const {user} = useAuth();

    const [showDrawer, setShowDrawer] = useState(false);
    const [videoCalling, setVideoCalling] = useState(false);
    const [showConversation, setShowConversation] = useState(false);
    const [friendId, setFriendId] = useState('')
    const [isSearch, setIsSearch] = useState(false)
    const [isShowFriendModal, setIsShowFriendModal] = useState(false)
    const [friendModalInfo, setFriendModalInfo] = useState(null)

    const location = useLocation();

    const transitions = useTransition(location, {
        from: {opacity: 0, transform: "translate3d(-100px, 0, 0)"},
        enter: {opacity: 1, transform: "translate3d(0, 0, 0)"},
        leave: {opacity: 0, transform: "translate3d(-100px, 0, 1)"},
    });

    const isMessageList = !!matchPath(
        {
            path: "/",
            end: true,
        },
        location.pathname
    )

    const isContactList = !!matchPath(
        {
            path: "/contacts",
            end: true,
        },
        location.pathname
    )

    useEffect(() => {

        const showMessageToken = PubSub.subscribe("showMessage", (_, data) => {
            setShowConversation(data)
        })
        const closeToken = PubSub.subscribe("close", (_, data) => {
            setIsSearch(data)
        })
        const openToken = PubSub.subscribe("open", (_, data) => {
            setIsSearch(data)
        })
        const friendModalInfoToken = PubSub.subscribe("friendModalInfo", (_, data) => {
            if (data != null) {
                setIsShowFriendModal(true)
                setFriendModalInfo(data)
            }
        })
        const closeFriendModalToken = PubSub.subscribe("closeFriendModal", (_, data) => {
            setIsShowFriendModal(data)
        })
        if (!isMessageList) {
            setShowConversation(false)
        }

        if (!isContactList) {
            setIsShowFriendModal(false)
            setIsSearch(false)
        }

        return () => {
            PubSub.unsubscribe(showMessageToken)
            PubSub.unsubscribe(closeToken)
            PubSub.unsubscribe(openToken)
            PubSub.unsubscribe(friendModalInfoToken)
            PubSub.unsubscribe(closeFriendModalToken)
        }

    }, [isMessageList, isContactList])

    if (!user) {
        return <Navigate to={'/login'}></Navigate>
    }

    return (
        <StyledChatApp {...rest}>
            <Nav>
                <NavBar/>
            </Nav>
            <Sidebar>
                {/*{transitions(({item, props}) => (*/}
                {/*    <animated.div style={props}>*/}
                <Routes>
                    <Route path="/" element={<MessageList/>}/>
                    <Route path="/contacts" element={<ContactList/>}/>
                    <Route path="/groups" element={<ContactList/>}/>
                    <Route path="/files" element={<FileList/>}/>
                    <Route path="/notes" element={<NoteList/>}/>
                    <Route path="/settings/*" element={<EditProfile/>}/>
                </Routes>
                {/*    </animated.div>*/}
                {/*))}*/}
            </Sidebar>
            <Content>
                {videoCalling && (
                    <VideoCall onHangOffClicked={() => setVideoCalling(false)}/>
                )}

                {
                    showConversation && isMessageList && (<Conversation
                        onAvatarClick={() => setShowDrawer(true)}
                        onVideoClicked={() => setVideoCalling(true)}
                    />)
                }

                {
                    isSearch && isContactList && (
                        <Add></Add>
                    )
                }

                {
                    isShowFriendModal && isContactList && (
                        <FriendModal friendModalInfo={friendModalInfo}/>
                    )
                }

                <Routes>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/settings/blocked" element={<BlockedList/>}/>
                </Routes>
            </Content>
            <Drawer show={showDrawer}>
                <Profile onCloseClick={() => setShowDrawer(false)}/>
            </Drawer>
        </StyledChatApp>
    );
}

ChatApp.propTypes = {
    children: PropTypes.any,
};

export default React.memo(ChatApp);
