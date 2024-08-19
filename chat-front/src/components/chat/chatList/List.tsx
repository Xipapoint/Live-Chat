import { FC, useEffect, useState } from 'react';
import ChatCard from './card/ChatCard';
import styles from './ChatList.module.scss';
import $chat_api from '../../../http/chat';
import { IChatInterface } from '../../../models/chat/chat.interface';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useErrorToast from '../../../shared/hooks/toast';
import { IMessage } from '../../../models/chat/message.interface';

interface IChatListProps{
  searchTerm: string,
  onSelectChat: (chat: IChatInterface) => void,
  lastMessage: IMessage | null
}

const ChatList: FC<IChatListProps> = ({searchTerm, onSelectChat, lastMessage}) => {
  const [chatList, setChatList] = useState<IChatInterface[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { handleError, error } = useErrorToast();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await $chat_api.get('/rooms');
        setChatList(response.data)
        setLoading(false)
      } catch (err) {
        handleError(err);
        setLoading(false)
      }
    };

    fetchChatList();

  }, [lastMessage]);

  const filteredChats = chatList?.filter(chat =>
    `${chat.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.lastMessageTime).getTime();
    const dateB = new Date(b.lastMessageTime).getTime();
    return dateB - dateA; 
  });

  return (
    loading ? <p>Loading...</p> :
    error 
    ? 
      <div><p>Couldn`t find chats</p><ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
      </div> 
    :
    <div className={styles.chatList}>
      {filteredChats?.map(chat => (
        <div
        className={styles.container}
          key={chat._id}
          onClick={() => onSelectChat(chat)}
        >
        <ChatCard
          key={chat._id} 
          avatarUrl='avatar.png'
          name={chat.name}
          date={chat.lastMessageTime}
          message={chat.lastMessageText}
        />
      </div>
      ))}
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    </div>
  );
};

export default ChatList;