// 秒 ------ 分:秒
export const formatTime = (seconds: number) => {
    seconds = Math.floor(seconds);
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    let mins = ("0" + min).slice(-2);
    let secs = ("0" + sec).slice(-2);
    return `${mins}:${secs}`;
}

// 分:秒 ------ 秒
export function toSeconds(seconds: string): number {
    if(seconds && seconds.includes(':')) {
        const time = seconds.split(':').map(Number);
        return time[0] * 60 + time[1];
    }
    return 0;
}

// 分:秒.毫秒 ------ 秒
export function msToSeconds(seconds: string): number {
    if(seconds.includes('.')) {
        const time = seconds.split('.');
        return toSeconds(time[0]) + Number(`0.${time[1]}`);
    }else {
        return toSeconds(seconds);
    }
}

// 毫秒----------年-月-日
export function timestampToDate(timestamp: any) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 月从0开始，所以需要加1
    var day = ("0" + date.getDate()).slice(-2); // 对于不满两位的月份或日期前面补0
    return year + "-" + month + "-" + day;
  }
  
// 指定范围的随机数
export const nextInt = (max:number) => {
    max = max || 1024
    const limit = max < 1024 ? 1024 : max
    return Math.floor(Math.random() * limit) % max
}

// 随机长度字符串
export const randomText = (src:any, len:number) => {
    let result = []
    for (let i = 0; i < len; i++) {
        const index = Math.floor(Math.random() * (src.length - 1))
        result.push(src.charAt(index))
    }
    return result.join('')
}

// 去空
export const toTrimString = (value:any) => {
    value = (value === 0 ? '0' : value)
    return (value || '').toString().trim()
}