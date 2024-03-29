import React from "react";
import { parseISO, format } from "date-fns";

export default function DateComponent({
  dateString,
  label,
  dateFormat = "LLLL d, yyyy",
}) {
  let date;

  if (typeof dateString === "number") {
    // If dateString is a timestamp, convert it to an ISO 8601 formatted string
    date = new Date(dateString).toISOString();
  } else {
    date = dateString;
  }

  return (
    <>
      {label} <time dateTime={date}>{format(parseISO(date), dateFormat)}</time>
    </>
  );
}

export const DateInterval = ({ providedDate }) => {
  const currentDate = new Date();
  const targetDate = new Date(providedDate);

  const timeDifferenceInMilliseconds = currentDate - targetDate;
  const timeDifferenceInDays = Math.floor(
    timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
  );
  const timeDifferenceInMinutes = Math.floor(
    timeDifferenceInMilliseconds / (1000 * 60)
  );

  const calculateTimeDistance = () => {
    if (timeDifferenceInMinutes <= 1) {
      return "刚刚";
    } else if (timeDifferenceInDays <= 0) {
      const hours = Math.floor(timeDifferenceInMinutes / 60);
      const minutes = timeDifferenceInMinutes % 60;
      if (hours > 0) {
        return `${hours}小时${minutes}分钟前`;
      } else {
        return `${minutes}分钟前`;
      }
    } else if (timeDifferenceInDays <= 15) {
      return `${timeDifferenceInDays}天前`;
    } else if (timeDifferenceInDays <= 30) {
      return "一个月前";
    } else if (timeDifferenceInDays <= 180) {
      return "半年前";
    } else {
      const years = Math.floor(timeDifferenceInDays / 365);
      return `${years}年前`;
    }
  };

  return <span>{calculateTimeDistance()}</span>;
};
