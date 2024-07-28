import { Request, Response } from 'express';
import roomService from '../services/roomService';
import { IRoomServiceImpl } from '../services/impl/roomServiceImpl';
import { IChangeRoomNameRequestDTO } from '../dto/request/ChangeRoomRequestDTO';
import { ICreateRoomRequestDTO } from '../dto/request/CreateRoomNameRequestDTO';
import jwt from 'jsonwebtoken'
class ChatController {
    chatService: IRoomServiceImpl;

    constructor(roomService: IRoomServiceImpl) {
        this.chatService = roomService;
    }

    public createRoom = async (req: Request<{}, {}, ICreateRoomRequestDTO>, res: Response): Promise<void> => {
        try {
            const roomData: ICreateRoomRequestDTO = req.body;
            const newRoom = await this.chatService.createRoom(roomData);
            res.status(201).json(newRoom);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public changeRoomName = async (req: Request<{},{}, IChangeRoomNameRequestDTO>, res: Response): Promise<void> => {
        try {
            const roomData: IChangeRoomNameRequestDTO = req.body;
            const updatedRoom = await this.chatService.changeRoomName(roomData);
            res.status(200).json(updatedRoom);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public getAllRooms = async (req: Request, res: Response): Promise<void> => {
        try {
          const {refreshToken} = req.cookies; // Read userId from cookies
          const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
          console.log('Decoded Token:', decodedToken);
          const userId: string = (decodedToken as any).userId;
          if (!userId) {
            console.log(userId);
            
            res.status(400).json({ error: 'User ID not found in cookies' });
            return;
          }
    
          const rooms = await this.chatService.getAllRooms(userId);
          res.status(200).json(rooms);
        } catch (error: any) {
          res.status(400).json({ error: error.message });
        }
      };
}

export default new ChatController(roomService);
