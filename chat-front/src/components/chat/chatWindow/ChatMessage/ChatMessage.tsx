import React, { useState } from 'react';
import styles from './chatMessage.module.scss'; // Импорт стилей
import { IMessage } from '../../../../models/chat/message.interface';

interface IChatMessageProps {
  message: IMessage
  text: string;
  isMine: boolean; 
}

const ChatMessage: React.FC<IChatMessageProps> = ({message, isMine }) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setStartX(event.clientX);
    setIsSwiping(true);
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, message: IMessage) => {
    if (isSwiping && startX !== null) {
      const currentX = event.clientX;
      const diff = currentX - startX;
  
      if (diff > 100) {
        handleReply(message); 
        setIsSwiping(false);
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsSwiping(false);
    setStartX(null);
  };
  
  const handleMouseLeave = () => {
    setIsSwiping(false);
    setStartX(null);
  };
  

  return (
    <div
      className={`${styles.message} ${isMine ? styles.mine : styles.theirs}`}
      onMouseDown={handleMouseDown}
      onMouseMove={(event) => handleMouseMove(event, message)}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <p className={styles.messageText}>{message.message}</p>
      <p className={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString().slice(0,5)}</p>
    </div>
  );
};

export default ChatMessage;
