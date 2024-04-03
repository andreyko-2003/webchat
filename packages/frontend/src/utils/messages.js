export const isSameSender = (messages, i) => {
  return (
    i > 0 &&
    messages[i] &&
    messages[i].sender &&
    messages[i - 1].sender &&
    messages[i - 1].sender._id === messages[i].sender._id
  );
};

export const isLastMessage = (messages, i) => {
  return (
    i === messages.length - 1 ||
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== messages[i].sender._id)
  );
};
