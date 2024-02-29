export const formatTime = (seconds: number) => {
    seconds = Math.floor(seconds);
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    let mins = ("0" + min).slice(-2);
    let secs = ("0" + sec).slice(-2);
    return `${mins}:${secs}`;
}

export function toSeconds(seconds: string): number {
    const time = seconds.split(':').map(Number);
    return time[0] * 60 + time[1];
  }

export const nextInt = (max:number) => {
    max = max || 1024
    const limit = max < 1024 ? 1024 : max
    return Math.floor(Math.random() * limit) % max
}