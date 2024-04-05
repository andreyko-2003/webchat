export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDate = (date) => {
  const currentDate = new Date();
  const messageDate = new Date(date);

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  if (messageDate >= today) {
    return "Today";
  } else if (messageDate >= yesterday) {
    return "Yesterday";
  } else {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return messageDate.toLocaleDateString(undefined, options);
  }
};

export const latestActivityFormatDateTime = (timestamp) => {
  const currentDate = new Date();
  const activityDate = new Date(timestamp);
  const timeDiff = currentDate - activityDate;

  const timeDiffInSeconds = Math.floor(timeDiff / 1000);

  if (timeDiffInSeconds < 60) {
    return "Few seconds ago";
  } else if (timeDiffInSeconds < 3600) {
    const minutes = Math.floor(timeDiffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDiffInSeconds < 21600) {
    const hours = Math.floor(timeDiffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (timeDiffInSeconds < 86400) {
    const hours = activityDate.getHours().toString().padStart(2, "0");
    const minutes = activityDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else if (timeDiffInSeconds < 172800) {
    return "Yesterday";
  } else {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return activityDate.toLocaleDateString(undefined, options);
  }
};
