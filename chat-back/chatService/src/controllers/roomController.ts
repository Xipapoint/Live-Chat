import e, { NextFunction, Request, Response } from 'express';
import { IRoomServiceImpl } from '../services/impl/roomServiceImpl';
import { IChangeRoomNameRequestDTO } from '../dto/request/ChangeRoomRequestDTO';
import { ICreateRoomRequestDTO } from '../dto/request/CreateRoomNameRequestDTO';
import ChatService from '../services/roomService';
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/4__Error/BadRequestError.error';
import messageService from '../services/messageService';
class ChatController {
    chatService: IRoomServiceImpl;

    constructor(roomService: IRoomServiceImpl) {
        this.chatService = roomService;
    }

    public createRoom = async (req: Request<{}, {}, ICreateRoomRequestDTO>, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log("started creating");
            
            const roomData: ICreateRoomRequestDTO = req.body;
            const newRoom = await this.chatService.createRoom(roomData);
            res.status(201).json(newRoom);
        } catch (error) {
            next(error)
        }
    };

    public changeRoomName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log("started changing");
            
            const roomData: IChangeRoomNameRequestDTO = req.body;
            const {roomId} = req.params
            const updatedRoom = await this.chatService.changeRoomName(roomData, roomId);
            res.status(200).json(updatedRoom);
        } catch (error) {
            next(error)
        }
    };

    public getAllRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const {refreshToken} = req.cookies;
          console.log(refreshToken);
          
          const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
          const userId: string = (decodedToken as any).userId;
          if (!userId) {
            throw new BadRequestError('User ID not found in cookies');
          }
          const rooms = await this.chatService.getAllRooms(userId);
          console.log("controller rooms: ", rooms);
          
          res.status(200).json(rooms);
        } catch (error: any) {
          next(error)
        }
      };

      async getMessagesByRoomId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roomId } = req.params;
            console.log(roomId);
            if (!roomId) {    
                res.status(400).send('RoomId is required');
                return;
            }

            const messages = await messageService.getMessagesByRoomId(roomId);
            
            res.status(200).json(messages);
        } catch (error) {
            next(error)
        }
    }

    async deleteRoomById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roomId } = req.params;
            console.log(roomId);
            if (!roomId) {    
                res.status(400).send('RoomId is required');
                return;
            }
            const result = await ChatService.deleteRoomById(roomId);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
}

export default new ChatController(ChatService);
