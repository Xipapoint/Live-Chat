import React, { FC } from 'react';
import styles from './deleteRoomModal.module.scss';

interface DeleteRoomModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteRoomModal: FC<DeleteRoomModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.deleteModal}>
      <div className={styles.deleteModalContent}>
        <p>Вы уверены, что хотите удалить комнату?</p>
        <button onClick={onConfirm}>Да</button>
        <button onClick={onCancel}>Нет</button>
      </div>
    </div>
  );
};

export default DeleteRoomModal;
