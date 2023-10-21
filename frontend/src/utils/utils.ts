
export function formatTime(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}


export function millisToMinutesAndSeconds(millis: number) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
}