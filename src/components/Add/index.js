import React, {useState} from "react";
import PropTypes from "prop-types";
import StyledAdd from "./style";
import {Avatar, Input, List} from 'antd';
import PubSub from "pubsub-js";
import {useSdk} from "../../sdk/SdkContext";
import _ from "lodash"
import {CloseCircleOutlined, CloseCircleTwoTone} from "@ant-design/icons";

const {Search} = Input;

const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];


function Add({children, ...rest}) {
    const [searchContent, setSearchContent] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    const im = useSdk()

    const searchHandler = (value) => {
        setIsLoading(true)
        im.getUserInfo([value]).then((result) => {
            setSearchContent([result.data.userDataItems[0]])
            setIsLoading(false)
        }).catch((error) => {
            throw new Error(error)
        })
        im.verifyFriendship(2, [value]).then((result) => {
            if (result.data[0].status === 1) {
                setIsAdded(true)
            }
        }).catch((error) => {
            throw new Error(error)
        })
    }

    const changeHandler = _.debounce((e) => {
        if (e.target.value === '') {
            console.log(1111)
            // setSearchContent([])
        }
    }, 500)

    const addFriendHandler = (item) => {
        setIsAdded(true)
        im.addFriend({
            toId: item.userId,
            remark: '',
            addSource: '搜索ID添加',
            addWording: '',
            extra: ''
        }).then((result) => {
            PubSub.publish("addFriend", result.data.friendShipEntity[0])
        }).catch(error => {
            throw new Error(error)
        })
    }

    const closeHandler = () => {
        PubSub.publish("close", false)
    }

    return (
        <StyledAdd {...rest}>
            <CloseCircleOutlined style={{fontSize: "25px", color: "#4F9DDE"}} onClick={closeHandler}/>
            <Search placeholder="input search loading with enterButton"
                    loading={isLoading}
                    enterButton
                    bordered={false}
                    onSearch={searchHandler}
                    size={"large"}
                    allowClear
                    onChange={changeHandler}
            />
            <List
                itemLayout="horizontal"
                dataSource={searchContent}
                renderItem={(item, index) => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit" disabled={isAdded} onClick={() => {
                            addFriendHandler(item)
                        }}>{isAdded ? "已添加" : "添加好友"}</a>]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar
                                src={item.photo ? item.photo : `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}/>}
                            title={item.userId}
                            description={item.selfSignature}
                        />
                    </List.Item>
                )}
            />
        </StyledAdd>
    );
}

Add.propTypes = {
    children: PropTypes.any
};

export default Add;
