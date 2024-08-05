import React, { useState } from 'react'
import styles from './createRoomModal.module.scss'
interface ICreateRoomModalProps{
  onCancel: () => void
  onCreate: (firstName: string, lastName: string) => Promise<void>
}
const CreateRoomModal: React.FC<ICreateRoomModalProps> = ({onCancel, onCreate}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleCreate = () => {
    onCreate(firstName, lastName);
  };


  return (
    <div className={styles.createModal}>
      <div className={styles.createModalContent}>
        <input 
          type="text"
          placeholder="Новое имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          />
        <input 
          type="text"
          placeholder="Новая фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={handleCreate}>Создать</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  )
}

export default CreateRoomModal
