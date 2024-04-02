export const groupMessagesByDate = (messages) => {
  const groupedMessages = [];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  messages.forEach((message) => {
    const createdAt = new Date(message.createdAt);
    let date;

    if (
      createdAt.getDate() === today.getDate() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    ) {
      date = "Today";
    } else if (
      createdAt.getDate() === yesterday.getDate() &&
      createdAt.getMonth() === yesterday.getMonth() &&
      createdAt.getFullYear() === yesterday.getFullYear()
    ) {
      date = "Yesterday";
    } else {
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      date = createdAt.toLocaleDateString("en-US", options);
    }

    const existingGroup = groupedMessages.find((group) => group.date === date);
    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groupedMessages.push({ date, messages: [message] });
    }
  });

  return groupedMessages;
};

export const addNewMessageToGroupedMessagesByDate = (messages, message) => {
  const existingDayMessages = messages.find(
    (dayMessages) => dayMessages.date === "Today"
  );

  if (existingDayMessages) {
    existingDayMessages.messages.push(message);
  } else {
    messages.push({ date: "Today", messages: [message] });
  }
  return messages;
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
