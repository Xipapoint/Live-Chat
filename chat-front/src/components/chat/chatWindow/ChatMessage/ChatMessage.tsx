import React, { useState } from 'react';
import styles from './chatMessage.module.scss'; // Импорт стилей
import { IMessage } from '../../../../models/chat/message.interface';

interface IChatMessageProps {
  message: IMessage
  text: string;
  isMine: boolean; 
  replyMessageText: string | undefined;
  replyFirstName: string | undefined
  replyLastName: string | undefined
  isMessageReplied: boolean,
  setReplayToMessage: (message: IMessage | null) => void
  replyingMessage?: IMessage | null
}

const ChatMessage: React.FC<IChatMessageProps> = ({
  setReplayToMessage,
  message, 
  isMine, 
  replyMessageText,
  replyFirstName,
  replyLastName,
  isMessageReplied,
  replyingMessage
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [, setIsReplying] = useState<boolean>(false)
  const [positionX, setPositionX] = useState<number | null>(null)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    const divElement = event.currentTarget.getBoundingClientRect();
    setStartX(!isMine ? divElement.left : divElement.right);
    setIsSwiping(true)
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (isSwiping && startX !== null) {
      const currentX = event.clientX;
      console.log("current ", currentX);
      console.log("start ", startX);
      
      
      const diff = isMine ? currentX + startX : currentX - startX;
      setPositionX(currentX)
      console.log("trying to move ", diff);
      
      if (!isMine && diff > 150) {
        console.log("dif > 100");
        setIsReplying(true)
        setReplayToMessage(message)
        setIsSwiping(false);
        setPositionX(null)
      } else if(isMine && diff < 1870){
        console.log("dif < 1870");
        setIsReplying(true)
        setReplayToMessage(message)
        setIsSwiping(false);
        setPositionX(null)
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsSwiping(false);
    setStartX(null);
    setPositionX(null)
  };
  
  const handleMouseLeave = () => {
    setIsSwiping(false);
    setStartX(null);
    setPositionX(null)
  };


  return (
    <div
      className={`${styles.message} ${isMine ? styles.mine : styles.theirs } ` }
    >
      {(isMessageReplied) && (
        <div>
          <p>{replyFirstName + ' ' + replyLastName}</p>
          {replyMessageText}
        </div>
      )}
      <div
      className={`${styles.messageText}`}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => replyingMessage?._id !== message._id ? handleMouseDown(event) : null}
      onMouseMove={(event: React.MouseEvent<HTMLDivElement>) => replyingMessage?._id !== message._id ? handleMouseMove(event) : null}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ transform: isSwiping && positionX && startX ? `translateX(${positionX - startX!}px)` : 'none' }}
      >{message.message}</div>
      <p className={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString().slice(0,5)}</p>
    </div>
  );
};

export default ChatMessage;
