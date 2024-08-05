import { Router } from 'express';
import roomController from '../controllers/roomController';

const roomRouter = Router();
export const router = Router();

roomRouter.post('/create-room', roomController.createRoom);
roomRouter.put('/changename/:roomId', roomController.changeRoomName);
roomRouter.get('/rooms', roomController.getAllRooms);
roomRouter.get('/rooms/:roomId/messages', roomController.getMessagesByRoomId);
roomRouter.delete('/rooms/delete/:roomId', roomController.deleteRoomById)

router.use('/chat', roomRouter)

