import { Request, Response } from 'express';
import { IRoomServiceImpl } from '../services/impl/roomServiceImpl';
import { IChangeRoomNameRequestDTO } from '../dto/request/ChangeRoomRequestDTO';
import { ICreateRoomRequestDTO } from '../dto/request/CreateRoomNameRequestDTO';
import ChatService from '../services/roomService';
import jwt from 'jsonwebtoken'
class ChatController {
    chatService: IRoomServiceImpl;

    constructor(roomService: IRoomServiceImpl) {
        this.chatService = roomService;
    }

    public createRoom = async (req: Request<{}, {}, ICreateRoomRequestDTO>, res: Response): Promise<void> => {
        try {
            console.log("started creating");
            
            const roomData: ICreateRoomRequestDTO = req.body;
            const newRoom = await this.chatService.createRoom(roomData);
            res.status(201).json(newRoom);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public changeRoomName = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("started changing");
            
            const roomData: IChangeRoomNameRequestDTO = req.body;
            const {roomId} = req.params
            const updatedRoom = await this.chatService.changeRoomName(roomData, roomId);
            res.status(200).json(updatedRoom);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public getAllRooms = async (req: Request, res: Response): Promise<void> => {
        try {
          const {refreshToken} = req.cookies; // Read userId from cookies
          const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
          const userId: string = (decodedToken as any).userId;
          if (!userId) {
            res.status(400).json({ error: 'User ID not found in cookies' });
            return;
          }
          const rooms = await this.chatService.getAllRooms(userId);
          res.status(200).json(rooms);
        } catch (error: any) {
          res.status(400).json({ error: error.message });
        }
      };

      async getMessagesByRoomId(req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = req.params;
            console.log(roomId);
            if (!roomId) {    
                res.status(400).send('RoomId is required');
                return;
            }

            const messages = await ChatService.getMessagesByRoomId(roomId);
            
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async deleteRoomById(req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = req.params;
            console.log(roomId);
            if (!roomId) {    
                res.status(400).send('RoomId is required');
                return;
            }
            const messages = await ChatService.deleteRoomById(roomId);
            res.status(200).json(true);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new ChatController(ChatService);
