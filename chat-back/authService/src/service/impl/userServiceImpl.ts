import { GetNamesResponse } from "../../rabbitmq/types/response/responseTypes"

export interface IUserServiceImpl{
    getNamesById(userId: string): Promise<GetNamesResponse>
}