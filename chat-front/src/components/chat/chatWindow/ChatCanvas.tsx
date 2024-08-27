import { FC, useEffect, useRef, useState } from 'react';
import styles from './chatCanvas.module.scss';
import { IChatInterface } from '../../../models/chat/chat.interface.ts';
import { IMessage } from '../../../models/chat/message.interface.ts';
import $chat_api from '../../../http/chat.ts';
import ChatNav from './chatWindowNav/ChatNav.tsx';
import ChatMessage from './ChatMessage/ChatMessage.tsx';
import { IMessageFieldsWithReplyResponse } from '../../dto/response/message/IMessageFieldsWithReplyResponse.interface.ts';
import { ISendMessageWSRequestDTO } from '../../dto/request/SendMessageWSRequestDTO.ts';

interface IChatCanvasProps {
  chat: IChatInterface,
  setLastMessage: (message: IMessage) => void
}

const ChatCanvas: FC<IChatCanvasProps> = ({ chat, setLastMessage }) => {
  const [messages, setMessages] = useState<IMessageFieldsWithReplyResponse[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  // const [isReplying, setIsReplying] = useState
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
      const isReplying: boolean = replyToMessage ? true : false
      console.log(replyToMessage);
      
      const sendMessageRequest: ISendMessageWSRequestDTO = {
        roomId: chat._id, 
        userId: userId as string, 
        message: message,
        replyingMessageId: isReplying ? replyToMessage?._id : undefined,
        isReplying: isReplying
      }
      console.log(sendMessageRequest.replyingMessageId);
      
      wsRef.current.send(JSON.stringify(sendMessageRequest));
      setNewMessage('');
    }
  };

  const handleEnterDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

 const handleSetReplyToMessage = (replyToMessage: IMessage | null) => {
  setReplyToMessage(replyToMessage)
 }

  

  return (
    <div className={styles.chat}>
      <ChatNav chatName={chat.name} roomId={chat._id}/>
      <div className={styles.messages}>
        {messages.map((message) => (
          <ChatMessage
          replyingMessage={replyToMessage}
          isMessageReplied={typeof message.replyMessageId !== 'undefined'}
          replyMessageText={message.onReplyMessageText}
          replyFirstName={message.onReplyMessageFirstName}
          replyLastName={message.onReplyMessageLastName}
          setReplayToMessage={handleSetReplyToMessage}
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
