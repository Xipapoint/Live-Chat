import React from 'react';
import styles from './chatMessage.module.scss'; // Импорт стилей

interface IChatMessageProps {
  message: string;
  isMine: boolean; 
  timestamp: Date | string;
}

const ChatMessage: React.FC<IChatMessageProps> = ({ message, isMine, timestamp }) => {
  return (
    <div className={`${styles.message} ${isMine ? styles.mine : styles.theirs}`}>
      <p className={styles.messageText}>{message}</p>
      <p className={styles.timestamp}>{new Date(timestamp).toLocaleTimeString().slice(0,5)}</p>
    </div>
  );
};

export default ChatMessage;
