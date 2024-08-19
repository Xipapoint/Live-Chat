import User from "../models/userModel";
import { GetNamesResponse } from "../rabbitmq/types/response/responseTypes";
import { IUserServiceImpl } from "./impl/userServiceImpl";

class UserService implements IUserServiceImpl{
    async getNamesById(userId: string): Promise<GetNamesResponse>{
        const existingUser = await User.findById(userId).exec();
        if (!existingUser) {
            throw new Error("User doesn't exist");
        }
        return {secondFirstName: existingUser.firstName, secondLastName: existingUser.lastName }
    }

    async getUserByNames(firstName: string, lastName: string): Promise<string>{
        const existingUser = await User.findOne({ firstName: firstName, lastName: lastName }).exec();
        if (!existingUser) {
            throw new Error("User doesn't exist");
        }
        return existingUser._id.toString();
    }
    
}

export default new UserService()