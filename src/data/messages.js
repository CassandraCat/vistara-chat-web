import face1 from "assets/images/face-male-1.jpg";
import face3 from "assets/images/face-male-2.jpg";
import face5 from "assets/images/face-male-3.jpg";

import face2 from "assets/images/face-female-1.jpg";
import face4 from "assets/images/face-female-2.jpg";
import face6 from "assets/images/face-female-3.jpg";

const messageData = [
    {
        id: 1,
        avatarSrc: face1,
        name: "李铭浩",
        status: "online",
        statusText: "在线",
        time: "3 小时之前",
        message: "即使爬到最高的山上，一次也只能脚踏实地地迈一步",
        unreadCount: 2,
        replied: false,
    },
    {
        id: 2,
        avatarSrc: face2,
        name: "孙文佳",
        status: "offline",
        statusText: "离线",
        time: "下午 14:45",
        message: "好的，明天我就把资料送过去！感谢提醒！",
        unreadCount: 2,
        replied: false,
    },
    {
        id: 3,
        avatarSrc: face3,
        name: "慕容天宇",
        status: "offline",
        statusText: "离线",
        time: "昨天 16:30",
        message: "明天约一把王者荣耀，不连赢5把不罢休 🤘",
        unreadCount: 0,
        replied: true,
    }
];

export default messageData