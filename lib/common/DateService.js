import moment from "moment";

export function getDaysBetween(from, to) {
  const date1 = new Date(from);
  const date2 = new Date(to);
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = date2.getTime() - date1.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays;
}

export function parseDate(stringDate) {
  return new Date(stringDate);
}

export function compareDates(date1, date2) {
  console.log("currentData : ", date1);
  console.log("start date : ", date2);
  console.log(moment(date1).diff(moment(date2)));
  return moment(date1).diff(moment(date2)) >= 0;
}
