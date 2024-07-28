import { Router } from 'express';
import roomController from '../controllers/roomController';

const roomRouter = Router();
export const router = Router();

roomRouter.post('/create-room', roomController.createRoom);
roomRouter.put('/change-room-name', roomController.changeRoomName);
roomRouter.get('/rooms', roomController.getAllRooms);

router.use('/chat', roomRouter)

