import React, { FC, useState } from 'react';
import styles from './changeNameModal.module.scss';

interface ChangeNameModalProps {
  onSave: (newFirstName: string, newLastName: string) => void;
  onCancel: () => void;
}

const ChangeNameModal: FC<ChangeNameModalProps> = ({ onSave, onCancel }) => {
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  const handleSave = () => {
    onSave(newFirstName, newLastName);
  };

  return (
    <div className={styles.changeModal}>
      <div className={styles.modalContent}>
        <h3>Изменить имя комнаты</h3>
        <input
          type="text"
          placeholder="Новое имя"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Новая фамилия"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
};

export default ChangeNameModal;
