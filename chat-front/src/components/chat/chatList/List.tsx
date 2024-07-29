import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ChatCard from './card/ChatCard';
import styles from './ChatList.module.scss';
import $chat_api from '../../../http/chat';
import { IChatInterface } from '../../../models/chat/chat.interface';

const ChatList = () => {
  const [chatList, setChatList] = useState<IChatInterface[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        console.log(Cookies.get());
        
        const response = await $chat_api.get('/rooms');
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

  return (
    <div className={styles.chatList}>
      {chatList?.map(chat => (
        <ChatCard
          key={chat.firstName + chat.lastName} // Ensure each chat has a unique id
          avatarUrl={chat.avatarUrl}
          firstName={chat.firstName}
          lastName={chat.lastName}
          date={chat.lastMessageTime}
          message={chat.lastMessageText}
        />
      ))}
    </div>
  );
};

export default ChatList;
