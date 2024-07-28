import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ChatBlock from './ChatBlock';
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
        <ChatBlock
          key={chat._id} // Ensure each chat has a unique id
          avatarUrl={chat.avatarUrl}
          firstName={chat.roomFirstName}
          lastName={chat.roomLastName}
          date={chat.date}
          message={chat.message}
        />
      ))}
    </div>
  );
};

export default ChatList;
