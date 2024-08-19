import React, { FC, useState } from 'react';
import styles from './chatNav.module.scss';
import $chat_api from '../../../../http/chat';
import DeleteRoomModal from './modals/deleteRoom/DeleteRoomModal';
import ChangeNameModal from './modals/changeName/ChangeNameModal';

interface IChatNavProps {
  chatName: string,
  roomId: string;
}

const ChatNav: FC<IChatNavProps> = ({ chatName, roomId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openChangeNameModal = () => {
    setIsChangeNameModalOpen(true);
  };

  const closeChangeNameModal = () => {
    setIsChangeNameModalOpen(false);
  };

  const handleDeleteRoom = async () => {
    try {
      const response = await $chat_api.delete(`/rooms/delete/${roomId}`);
      if (response.status === 200) {
        console.log('Room deleted successfully');
      } else {
        console.error('Failed to delete room');
      }
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting room:', error);
      closeDeleteModal();
    }
  };

  const handleChangeName = async (firstName: string, lastName: string) => {
    if (firstName && lastName) {
      try {
        const response = await $chat_api.put(`/changename/${roomId}`, { firstName, lastName });
        if (response.status === 200) {
          chatName = firstName + ' ' + lastName
          console.log('Name changed successfully');
        } else {
          console.error('Failed to change name');
        }
        closeChangeNameModal();
      } catch (error) {
        console.error('Error changing name:', error);
        closeChangeNameModal();
      }
    }
  };

  return (
    <div className={styles.chatNav}>
      <h2>{chatName}</h2>
      <div onClick={toggleMenu} className={styles.menuContainer}>
        <img src={'settings_icon.png'} alt={`${chatName}`} className={styles.icon} />
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <ul>
              <li onClick={openDeleteModal}>Удалить комнату</li>
              <li onClick={openChangeNameModal}>Поменять имя</li>
            </ul>
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <DeleteRoomModal
          onConfirm={handleDeleteRoom}
          onCancel={closeDeleteModal}
        />
      )}

      {isChangeNameModalOpen && (
        <ChangeNameModal
          onSave={handleChangeName}
          onCancel={closeChangeNameModal}
        />
      )}
    </div>
  );
};

export default ChatNav;
