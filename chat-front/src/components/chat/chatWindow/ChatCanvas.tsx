import { FC, useEffect, useRef, useState } from 'react';
import styles from './chatCanvas.module.scss';
import { IChatInterface } from '../../../models/chat/chat.interface.ts';
import { IMessage } from '../../../models/chat/message.interface.ts';
import $chat_api from '../../../http/chat.ts';
import ChatNav from './chatWindowNav/ChatNav.tsx';
import ChatMessage from './ChatMessage/ChatMessage.tsx';
import { IMessageFieldsWithReplyResponse } from '../../dto/response/message/IMessageFieldsWithReplyResponse.interface.ts';

interface IChatCanvasProps {
  chat: IChatInterface,
  setLastMessage: (message: IMessage) => void
}

const ChatCanvas: FC<IChatCanvasProps> = ({ chat, setLastMessage }) => {
  const [messages, setMessages] = useState<IMessageFieldsWithReplyResponse[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [replyToMessage, setReplyToMessage] = useState<IMessage | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await $chat_api.get(`/rooms/${chat._id}/messages`);
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();
  }, [setLastMessage])
  
  useEffect(() => {

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`ws://localhost:5001?roomId=${chat._id}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.roomId === chat._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        setLastMessage(message);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [chat._id]);

  const handleSendMessage = () => {
    if (newMessage.trim() && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: string = newMessage;
      const userId = localStorage.getItem('userId')

      wsRef.current.send(JSON.stringify({ roomId: chat._id, userId, message }));
      setNewMessage('');
    }
  };

  const handleEnterDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setStartX(event.clientX);
    setIsSwiping(true);
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isSwiping && startX !== null) {
      const currentX = event.clientX;
      const diff = currentX - startX;
  
      if (diff > 100) {
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
    <div className={styles.chat}>
      <ChatNav chatName={chat.name} roomId={chat._id}/>
      <div className={styles.messages}
      
      
      >
        {messages.map((message) => (
          <ChatMessage
          replyMessageText={message.replyMessageId}
          onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => handleMouseDown(event)}
          onMouseMove={(event: React.MouseEvent<HTMLDivElement>) => handleMouseMove(event)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          message={message}
          key={message._id}
          text={message.message}
          isMine={localStorage.getItem('userId') === message.userId}
        />
        ))}
      </div>
      {replyToMessage && (
        <div className={styles.replyBlock}>
          <p>Replying to: {replyToMessage.message}</p>
          <button onClick={() => setReplyToMessage(null)}></button>
        </div>
      )}
      <div className={styles.messageInput}>
        <input
          className={styles.input}
          type="text"
          value={newMessage}
          onKeyDown={handleEnterDown}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
};

export default ChatCanvas;
