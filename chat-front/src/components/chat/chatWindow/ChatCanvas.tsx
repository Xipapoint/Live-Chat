import { FC, useEffect, useRef, useState } from 'react';
import styles from './chatCanvas.module.scss';
import { IChatInterface } from '../../../models/chat/chat.interface.ts';
import { IMessage } from '../../../models/chat/message.interface.ts';
import $chat_api from '../../../http/chat.ts';
import ChatNav from './chatWindowNav/ChatNav.tsx';
import ChatMessage from './ChatMessage/ChatMessage.tsx';
// import { useAppSelector } from '../../../shared/hooks/redux.ts';

interface IChatCanvasProps {
  chat: IChatInterface;
}
// interface IUserMessage {
//   roomId: string;
//   message: string;
// }

const ChatCanvas: FC<IChatCanvasProps> = ({ chat }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  // const [lastSendMessage, setLastSendMessage] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null);
  // const auth = useAppSelector(state => state.auth)
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(chat._id);
        
        const response = await $chat_api.get(`/rooms/${chat._id}/messages`);
        if (Array.isArray(response.data)) {
          console.log(response.data);
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

    // Initialize WebSocket connection
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
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
          console.log("Сообщения");
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
      };
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [chat._id]);

  const handleSendMessage = () => {
    if (newMessage.trim() && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: string = newMessage;
      const userId = localStorage.getItem('userId')

      wsRef.current.send(JSON.stringify({ roomId: chat._id, userId, message: message }));
      setNewMessage('');
    }
  };

  const handleEnterDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chat}>
      <ChatNav chatFirstName={chat.firstName} chatLastName={chat.firstName} roomId={chat._id}/>
      <div className={styles.messages}>
        {messages.map((message) => (
          <ChatMessage
          key={message._id}
          message={message.message}
          isMine={localStorage.getItem('userId') === message.userId}
          timestamp={message.timestamp}
        />
        ))}
      </div>
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
