import moment from "moment/moment";

const getWeekDay = (time) => {
    const week = moment(time).day()
    switch (week) {
        case 1:
            return '周一'
        case 2:
            return '周二'
        case 3:
            return '周三'
        case 4:
            return '周四'
        case 5:
            return '周五'
        case 6:
            return '周六'
        case 0:
            return '周日'
    }
}

export const formatTime = (time) => {
    const diffDay = moment(time).diff(moment(), 'days')
    const isSameYear = moment(time).isSame(moment(), 'year');
    if (isSameYear) {
        if (diffDay === 0) {
            time = moment(time).format('HH:mm:ss')
        } else if (diffDay === 1) {
            time = '昨天' + moment(time).format('HH:mm:ss')
        } else if (diffDay === 2) {
            time = '前天' + moment(time).format('HH:mm:ss')
        } else if (diffDay > 2 && diffDay <= 7) {
            time = getWeekDay(time) + moment(time).format('HH:mm:ss')
        } else {
            time = moment(time).format('MM月DD HH:mm:ss')
        }
    } else {
        time = moment(time).format('YYYY年MM月DD日 HH:mm:ss')
    }
    return time
}

export const formatDuration = (duration) => {
    // 👇️ 获取完整分钟数
    const minutes = Math.floor(duration / 60)

    // 👇️ 获得剩余的秒数
    const seconds = Math.floor(duration % 60)

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }

    // ✅ 格式化为 MM:SS
    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
}