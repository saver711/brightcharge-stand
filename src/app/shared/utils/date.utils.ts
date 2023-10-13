export const formatTime = (
  time: string | null | undefined,
  zone: string | null | undefined
) => {
  if (time) {
    let [hours, minutes] = time.split(':');
    if (hours === '12' && zone === 'AM') {
      hours = '00';
      return `${hours}:${minutes}:00`;
    } else if (hours === '12' && zone === 'PM') {
      return `${hours}:${minutes}:00`;
    } else if (zone == 'PM') {
      let hours = parseInt(time, 10) + 12;
      return `${hours}:${minutes}:00`;
    } else {
      return `${hours}:${minutes}:00`;
    }
  }
  return;
};
