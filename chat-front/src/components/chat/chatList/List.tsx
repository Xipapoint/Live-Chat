import { FC, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ChatCard from './card/ChatCard';
import styles from './ChatList.module.scss';
import $chat_api from '../../../http/chat';
import { IChatInterface } from '../../../models/chat/chat.interface';

interface IChatListProps{
  searchTerm: string,
  onSelectChat: (chat: IChatInterface) => void;
}

const ChatList: FC<IChatListProps> = ({searchTerm, onSelectChat}) => {
  const [chatList, setChatList] = useState<IChatInterface[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        console.log(Cookies.get());
        const response = await $chat_api.get('/rooms');
        console.log(response);
        setChatList(response.data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchChatList();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  const filteredChats = chatList?.filter(chat =>
    `${chat.firstName} ${chat.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.chatList}>

      {filteredChats?.map(chat => (
        <div
          className={styles.container}
          key={chat.firstName + chat.lastName}
          onClick={() => onSelectChat(chat)}
        >
        <ChatCard
          key={chat._id} // Ensure each chat has a unique id
          avatarUrl='avatar.png'
          firstName={chat.firstName}
          lastName={chat.lastName}
          date={chat.lastMessageTime as Date}
          message={chat.lastMessageText}
        />
      </div>
      ))}

    </div>
  );
};

export default ChatList;