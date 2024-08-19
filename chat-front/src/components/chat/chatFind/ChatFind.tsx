import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import styles from './ChatFind.module.scss'
import $chat_api from '../../../http/chat';
import CreateRoomModal from './modals/CreateRoomModal';
import { useNavigate } from 'react-router-dom';
import { IGetUserNamesResponseDTO } from '../../dto/response/user/GetUserNamesResponseDTO';
import useErrorToast from '../../../shared/hooks/toast';
import $user_api from '../../../http/user';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import {authSlice} from '../../../store/reducers/authSlice';

interface IChatFindProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const ChatFind: FC<IChatFindProps>  = ({ searchTerm, onSearchChange }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { handleError, error } = useErrorToast();
  const [names, setNames] = useState<string>('')
  const auth = useAppSelector(state => state.auth)
  const userId = auth.userId
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const {logout} = authSlice.actions
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    dispatch(logout())
  }
  useEffect(() => {
    const getNames = async () => {
      try {
        const response = await $user_api.get(`/names/${userId}`)
        const {firstName, lastName}: IGetUserNamesResponseDTO = response.data;
        console.log(response);
        
        setNames(firstName + ' ' + lastName)
      } catch (error) {
        console.log(error);
        
        handleError(error)
      }
    }

    getNames()
  }, [])


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
        <div style={{display: 'flex', width: '130px'}}>
          <img src="/avatar.png" alt="" />
          <p>{error ? 'Ошибка' : names}</p>
        </div>
        <button onClick={handleLogout}>logout</button>
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
