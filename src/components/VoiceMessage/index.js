import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import StyledVoiceMessage from "./style";

import {ReactComponent as Play} from "assets/icons/play.svg";
import {ReactComponent as Pause} from "assets/icons/pause.svg";
import {ReactComponent as Wave} from "assets/icons/wave.svg";
import {useTheme} from "styled-components";
import Button from "components/Button";
import Icon from "components/Icon";
import Text from "components/Text";
import ReactAudioPlayer from "react-audio-player";
import {formatDuration} from "../../utils/formatTime";

let totalTime;

function VoiceMessage({children, src, type, ...rest}) {
    const theme = useTheme();

    const audioRef = useRef()
    const [isPlay, setIsPlay] = useState(false)
    const [duration, setDuration] = useState(0)

    const playAudio = () => {
        audioRef.current.audioEl.current.play()
        setIsPlay(true)
    }

    const pauseAudio = () => {
        audioRef.current.audioEl.current.pause()
        setIsPlay(false)
    }

    const audioListen = () => {
        setDuration(prevState => prevState - 1)
    }

    const audioDataLoaded = async (element) => {
        const firsthandAudio = element.target;
        while (firsthandAudio.duration === Infinity) {
            await new Promise(r => setTimeout(r, 200));
            firsthandAudio.currentTime = 10000000 * Math.random();
        }
        firsthandAudio.currentTime = 0
        setDuration(firsthandAudio.duration)
        totalTime = firsthandAudio.duration
    }

    const audioEnded = (element) => {
        setIsPlay(false)
        const firsthandAudio = element.target;
        setDuration(firsthandAudio.duration)
    }

    return (
        <StyledVoiceMessage size={
            totalTime < 10 ? '250px' :
                totalTime < 30 ? '300px' :
                    totalTime < 60 ? '350px' :
                        totalTime < 90 ? '400px' : '100%'
        } type={type} {...rest}>
            <Button size="35px">
                {
                    !isPlay && <Icon
                        icon={Play}
                        color="white"
                        width="14"
                        height="16"
                        style={{transform: "translateX(1px)"}}
                        onClick={playAudio}
                    />
                }
                {
                    isPlay && <Icon
                        icon={Pause}
                        color="white"
                        width="14"
                        height="16"
                        style={{transform: "translateX(1px)"}}
                        onClick={pauseAudio}
                    />
                }
            </Button>
            <Icon icon={Wave} width="100%" height="100%" color={theme.primaryColor}/>
            <ReactAudioPlayer
                src={src}
                controls
                preload={"auto"}
                ref={audioRef}
                style={{display: 'none'}}
                onListen={audioListen}
                listenInterval={1000}
                onLoadedMetadata={audioDataLoaded}
                onEnded={audioEnded}
            />
            <Text bold>{formatDuration(duration)}</Text>
        </StyledVoiceMessage>
    );
}

VoiceMessage.propTypes = {
    children: PropTypes.any,
    type: PropTypes.oneOf(["mine"]),
    time: PropTypes.string,
};

export default VoiceMessage;
