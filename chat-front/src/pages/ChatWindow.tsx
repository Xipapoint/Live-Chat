import React, { ChangeEvent, FC, useState } from 'react'
import ChatList from '../components/chat/chatList/List'
import styles from './chatWindows.module.scss'
import ChatFind from '../components/chat/chatFind/ChatFind'
import ChatCanvas from '../components/chat/chatWindow/ChatCanvas'
import { IChatInterface } from '../models/chat/chat.interface'
import { IMessage } from '../models/chat/message.interface'

const ChatWindow: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<IChatInterface | null>(null);
  const [lastMessage, setLastMessage] = useState<IMessage | null>(null)

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleChatSelect = (chat: IChatInterface) => setSelectedChat(chat);

  const handleSetLastMessage = (message: IMessage) => setLastMessage(message)

  return (
    <div style={{display: 'flex'}}>
      <div className={styles.chatLeftNavbar}>
        <ChatFind searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <ChatList searchTerm={searchTerm} onSelectChat={handleChatSelect} lastMessage={lastMessage}/>
      </div>
      <div className={styles.chatBlock}>
        {selectedChat ? (
          <ChatCanvas chat={selectedChat} setLastMessage={handleSetLastMessage}/>
        ) : (
          <p style={{marginTop: '30%', marginLeft: '30%'}}>Select a chat to view details</p>
        )}
      </div>
    </div>
  )
}

export default ChatWindow
