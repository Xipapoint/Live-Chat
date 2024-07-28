import { ICreateRoomRequestDTO } from '../dto/request/CreateRoomNameRequestDTO';
import { IChangeRoomNameRequestDTO } from '../dto/request/ChangeRoomRequestDTO';
import Room, { IRoom } from '../models/roomModel';
import producer from '../rabbitMQ/producer';
class ChatService{
    async createRoom(roomData: ICreateRoomRequestDTO): Promise<IRoom>{
        const existingRoom: IRoom | null  = await Room.findOne({ roomFirstName: roomData.lastName, roomLastName: roomData.lastName }).exec();
        if(existingRoom) throw new Error("Room already exists");
        const testId = roomData.userId 
        const data = {firstName: roomData.firstName, lastName: roomData.lastName}
        const testSecondId = await producer.publishMessage(data) // отправить запрос в rabbit
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

    async getAllRooms(userId: string): Promise<IRoom[]>{
        console.log("зашли");
        const allRooms: IRoom[] = await Room.find({ users: { $in: [userId] } });
        console.log(allRooms);
        
        if(allRooms === null){
            console.log("Rooms with this person dont exist");
            throw new Error("Rooms with this person dont exist")
        }
        console.log(allRooms);
        
        return allRooms
    }
}

export default new ChatService();