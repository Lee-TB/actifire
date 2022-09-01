// export const formatDateTime = (date) =>
//   new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'numeric',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//     hour12: false,
//   }).format(date);

export const formatMonth = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(date);

export const formatVietnamDateTime = (date) =>
  new Intl.DateTimeFormat('vi-VN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date); // Thứ Tư, 1 tháng 9, 2021

const data = Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'full',
  timeStyle: 'medium',
}).format(Date.now()); //result: 09:32:31 Thứ Tư, 1 tháng 9, 2021

export const formatDateTime = (date) =>
  Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
