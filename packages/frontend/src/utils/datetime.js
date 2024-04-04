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
