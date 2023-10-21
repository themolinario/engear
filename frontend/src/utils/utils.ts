// export function formatTime(seconds: number) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const formattedHours = String(hours).padStart(2, "0");
//   const formattedMinutes = String(minutes).padStart(2, "0");
//   return `${formattedHours}:${formattedMinutes}`;
// }

export function formatTime(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
  // const hours = Math.floor(seconds / 3600);
  // const minutes = Math.floor((seconds % 3600) / 60);
  // const remainingSeconds = seconds % 60;
  // const formattedHours = String(hours).padStart(2, "0");
  // const formattedMinutes = String(minutes).padStart(2, "0");
  // const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  // return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


export function millisToMinutesAndSeconds(millis: number) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
}