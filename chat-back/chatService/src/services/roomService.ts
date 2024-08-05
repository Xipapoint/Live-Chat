import { ICreateRoomRequestDTO } from '../dto/request/CreateRoomNameRequestDTO';
import { IChangeRoomNameRequestDTO } from '../dto/request/ChangeRoomRequestDTO';
import Room, { IRoom } from '../models/roomModel';
import producer from '../rabbitMQ/producer';
import { IAllRoomsInterface } from '../dto/response/AllRooms.interface';
import { mapRoomToAllRoomsInterface } from '../helpers/mappers/Mapper';
import Message, { IMessage } from '../models/messageModel';
import messageService from './messageService';
class ChatService{



    async createRoom(roomData: ICreateRoomRequestDTO): Promise<IRoom>{
        const data = {firstName: roomData.firstName, lastName: roomData.lastName}
        console.log("in service");
        console.log(roomData);
        
        const secondId = await producer.publishMessage(data) 
        const existingRoom = await Room.findOne({users: [{_id: roomData.userId}, {_id: secondId}]})
        console.log(existingRoom);
        
        if(existingRoom) throw new Error("Room already exists");
        const testId = roomData.userId 
        const newRoom = new Room({
            roomFirstName: roomData.firstName + ' ' + roomData.lastName, 
            roomLastName: , 
            users: [{_id: testId}, {_id: secondId}]
        })
        await newRoom.save()
        console.log(newRoom);
        
        return newRoom;
    }

    async changeRoomName(roomData: IChangeRoomNameRequestDTO, roomId: string): Promise<IRoom> {
        try {
            const existingRoom: IRoom | null = await Room.findById(roomId);
            if (!existingRoom) {
                throw new Error("Room doesn't exist");
            }
    
            existingRoom.roomFirstName = roomData.firstName;
            existingRoom.roomLastName = roomData.lastName;
            
            console.log(existingRoom.roomFirstName + ' ' + existingRoom.roomLastName);
            console.log(roomData);
    
            const updatedRoom = await existingRoom.save();
            return updatedRoom;
        } catch (error) {
            console.error(`Error changing room name: ${error}`);
            throw error;
        }
    }
    

    async getAllRooms(userId: string): Promise<IAllRoomsInterface[]>{
        const allRooms: IRoom[] = await Room.find({ users: { $in: [userId] } });
        if(allRooms === null){
            console.log("Rooms with this person dont exist");
            throw new Error("Rooms with this person dont exist")
        }
        const rooms = mapRoomToAllRoomsInterface(allRooms)
        console.log(allRooms);
        
        return rooms
    }

    async getMessagesByRoomId(roomId: string): Promise<IMessage[]> {
        try {
            console.log("сообщения");
            
            const existingRoom = await Room.findById(roomId).populate('messages');
            if (!existingRoom) throw new Error("Room doesn't exist");
            
            return existingRoom.messages;
        } catch (error) {
            console.error(`Error getting messages for room ${roomId}:`, error);
            throw error;
        }
    }

    async getRoomInfo(roomId: string): Promise<string>{
        const existingRoom: IRoom | null = await Room.findById(roomId)
        if(!existingRoom) throw new Error("Room doesnt exist");
        return ''
    }

    async deleteRoomById(roomId: string): Promise<boolean>{
        try{
            const existingRoom: IRoom | null = await Room.findById(roomId)
            if(!existingRoom) throw new Error("Room doesnt exist");
            if(await existingRoom.deleteOne({_id: roomId})) return true
            return false
        } catch(e){
            console.error(e)
            throw Error
        }
    }
}

export default new ChatService();