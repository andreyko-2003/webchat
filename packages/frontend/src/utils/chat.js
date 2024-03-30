import { getContact } from "./contacts";

export const getChatInfo = (chat, user) => {
  if (chat.isGroupChat) {
    return {
      title: chat.chatName,
      description: chat.chatDescription,
      avatar: chat.avatar,
    };
  } else {
    const contact = getContact(chat, user);
    return {
      title: `${contact.firstName} ${contact.lastName}`,
      avatar: contact.avatar,
      email: contact.email,
    };
  }
};
