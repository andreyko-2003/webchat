export const getContacts = (chats, user) => {
  const filteredChats = chats.filter((chat) => !chat.isGroupChat);

  const contacts = [];
  filteredChats.forEach((chat) => {
    chat.users.forEach((chatUser) => {
      if (chatUser._id !== user._id) {
        if (!contacts.find((contact) => contact._id === chatUser._id)) {
          contacts.push(chatUser);
        }
      }
    });
  });

  return contacts;
};

export const getContact = (chat, user) => {
  return chat.users.filter((chatUser) => chatUser._id !== user._id)[0];
};
