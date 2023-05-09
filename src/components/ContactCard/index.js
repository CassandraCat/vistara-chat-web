import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import StyledContactCard, {Intro, Name} from "./style";
import face from "assets/images/face-male-2.jpg";
import Avatar from "components/Avatar";
import {useSdk} from "../../sdk/SdkContext";
import PubSub from "pubsub-js";

function ContactCard({contact, children, ...rest}) {

    const im = useSdk()
    const [contactInfo, setContactInfo] = useState({})

    useEffect(() => {
        im.getUserInfo([contact.toId]).then(result => {
            setContactInfo({...result.data.userDataItems[0]})
        }).catch(err => {
            throw new Error(err)
        })
    }, [contact.toId])

    const transformInfo = () => {
        PubSub.publish("friendModalInfo", contactInfo)
    }

    return (
        <StyledContactCard {...rest} onClick={transformInfo}>
            <Avatar src={contactInfo.photo ? contact.photo : face} status="online"/>
            <Name>{contact.remark ? contact.remark : contact.toId}</Name>
            <Intro>{contactInfo.selfSignature}</Intro>
        </StyledContactCard>
    );
}

ContactCard.propTypes = {
    children: PropTypes.any,
};

export default ContactCard;
