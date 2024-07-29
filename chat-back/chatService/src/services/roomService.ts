import { ICreateRoomRequestDTO } from '../dto/request/CreateRoomNameRequestDTO';
import { IChangeRoomNameRequestDTO } from '../dto/request/ChangeRoomRequestDTO';
import Room, { IRoom } from '../models/roomModel';
import producer from '../rabbitMQ/producer';
import { IAllRoomsInterface } from '../dto/response/AllRooms.interface';
import { mapRoomToAllRoomsInterface } from '../helpers/mappers/Mapper';
class ChatService{
    async createRoom(roomData: ICreateRoomRequestDTO): Promise<IRoom>{
        const data = {firstName: roomData.firstName, lastName: roomData.lastName}
        const testSecondId = await producer.publishMessage(data) 
        const existingRoom = await Room.findOne({users: [{_id: roomData.userId}, {_id: testSecondId}]})
        if(existingRoom) throw new Error("Room already exists");
        const testId = roomData.userId 
        const newRoom = new Room({roomFirstName: roomData.firstName, roomLastName: roomData.lastName, users: [{_id: testId}, {_id: testSecondId}]})
        await newRoom.save()
        return newRoom;
    }

    async changeRoomName(roomData: IChangeRoomNameRequestDTO): Promise<IRoom>{
        const existingRoom: IRoom | null = await Room.findById(roomData.roomId)
        if(!existingRoom) throw new Error("Room doesnt exist");
        existingRoom.roomFirstName = roomData.firstName;
        existingRoom.roomLastName = roomData.lastName;
        await existingRoom.save()
        return existingRoom;
    }

    async getAllRooms(userId: string): Promise<IAllRoomsInterface[]>{
        console.log("зашли");
        const allRooms: IRoom[] = await Room.find({ users: { $in: [userId] } });
        if(allRooms === null){
            console.log("Rooms with this person dont exist");
            throw new Error("Rooms with this person dont exist")
        }
        const rooms = mapRoomToAllRoomsInterface(allRooms)
        console.log(rooms);
        
        return rooms
    }
}

export default new ChatService();