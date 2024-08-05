import React, { ChangeEvent, FC, useState } from 'react'
import styles from './ChatFind.module.scss'
import $chat_api from '../../../http/chat';
import CreateRoomModal from './modals/CreateRoomModal';
import { useNavigate } from 'react-router-dom';

interface IChatFindProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const ChatFind: FC<IChatFindProps>  = ({ searchTerm, onSearchChange }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const userId = localStorage.getItem('userId')
  const navigate = useNavigate();
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateRoom = async (firstName: string, lastName: string) => {
    if((firstName || lastName).trim().length === 0) {
      closeModal()
    }
    try {
      const response = await $chat_api.post(`/create-room`, {firstName: firstName, lastName: lastName, userId: userId});
      if (response.status === 201) {
        navigate('/chat')
        console.log('Room created uccessfully');
        closeModal()
      } else {
        console.error('Failed to create room');
        closeModal()
      }
    } catch (error) {
      console.error('Error creating room:', error);
      closeModal()
    }
  };


  return (
    <div className={styles.chatFind}>
      <div className={styles.userActions}>
        <img src="/avatar.png" alt="" />
        <button>login</button>
      </div>
      <div className={styles.roomActions}>
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search chats..."
        />
        <button onClick={openModal} className={styles.createRoom}>Create room</button>
      </div>
      {isModalOpen && (
        <CreateRoomModal onCancel={closeModal} onCreate={handleCreateRoom}/>
      )}
    </div>
  )
}

export default ChatFind
