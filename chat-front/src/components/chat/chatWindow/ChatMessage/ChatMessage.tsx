import React from 'react';
import styles from './chatMessage.module.scss'; // Импорт стилей
import { IMessage } from '../../../../models/chat/message.interface';

interface IChatMessageProps {
  message: IMessage
  text: string;
  isMine: boolean; 
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseUp: () => void
  onMouseLeave: () => void
}

const ChatMessage: React.FC<IChatMessageProps> = ({onMouseDown, onMouseMove, onMouseUp, onMouseLeave, message, isMine }) => {
  return (
    <div
      className={`${styles.message} ${isMine ? styles.mine : styles.theirs}`}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => onMouseDown(event)}
      onMouseMove={(event: React.MouseEvent<HTMLDivElement>) => onMouseMove(event)}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <p className={styles.messageText}>{message.message}</p>
      <p className={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString().slice(0,5)}</p>
    </div>
  );
};

export default ChatMessage;
