import { ICreateRoomRequestDTO } from '../dto/request/CreateRoomNameRequestDTO';
import { IChangeRoomNameRequestDTO } from '../dto/request/ChangeRoomRequestDTO';
import Room, { IRoom } from '../models/roomModel';
import producer from '../rabbitMQ/producer';
import { IAllRoomsInterface } from '../dto/response/AllRoomsResponse.interface';
import { mapMessagesToAllMessagesInterface, mapRoomToAllRoomsInterface } from '../helpers/mappers/Mapper';
import Message, { IMessage } from '../models/messageModel';
import messageService from './messageService';
import { GetNamesResponse, GetUserResponse } from '../rabbitMQ/types/response/responseTypes';
import { GetUserRequestMessage, GetNamesRequestMessage } from '../rabbitMQ/types/request/requestTypes';
import { IMessageFieldsWithReplyResponse } from '../dto/response/IMessageFieldsWithReplyResponse.interface';
class ChatService{



    async createRoom(roomData: ICreateRoomRequestDTO): Promise<IRoom>{
        const data = {firstName: roomData.firstName, lastName: roomData.lastName}
        const getUserM: GetUserRequestMessage = {
            serviceType: 'getUser',
            data: {
                firstName: data.firstName,
                lastName: data.lastName
            }
        }
        console.log(getUserM);
        
        const IdResponse = await producer.publishMessage<GetUserResponse>(getUserM)
        const existingRoom = await Room.findOne({users: {$all: [{_id: roomData.userId}, {_id: IdResponse.userId}]} })
        console.log(existingRoom);
        
        if(existingRoom) throw new Error("Room already exists");
        const getNamesM: GetNamesRequestMessage = {
            serviceType: 'getNames',
            data: {
                id: roomData.userId
            }
        }
        console.log(getNamesM);
        
        const {secondFirstName, secondLastName} = await producer.publishMessage<GetNamesResponse>(getNamesM)
        console.log("names:", secondFirstName, secondLastName);
        
        const newRoom = new Room({
            roomFirstName: roomData.firstName + ' ' + roomData.lastName, 
            roomLastName: secondFirstName + ' ' + secondLastName, 
            users: [{_id: roomData.userId }, {_id: IdResponse.userId}]
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
        try {
            const allRooms: IRoom[] = await Room.find({ users: { $in: userId } });
            if(allRooms === null){
                console.log("Rooms with this person dont exist");
                throw new Error("Rooms with this person dont exist")
            }
            const getNamesM: GetNamesRequestMessage = {
                serviceType: 'getNames',
                data: {
                    id:  userId
                }
            }
            const {secondFirstName, secondLastName} = await producer.publishMessage<GetNamesResponse>(getNamesM)
            console.log("names: ", secondFirstName, secondLastName);
            const rooms = await mapRoomToAllRoomsInterface(allRooms, secondFirstName, secondLastName)
            console.log("rooms:", rooms);
            
            return rooms 
        } catch (error) {
            console.error(error)
            throw error
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
            return await existingRoom.deleteOne({_id: roomId})
        } catch(e){
            console.error(e)
            throw Error
        }
    }
}

export default new ChatService();