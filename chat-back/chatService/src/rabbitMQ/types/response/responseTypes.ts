export interface GetUserResponse {
    userId: string;
}

export interface GetNamesResponse{
    secondFirstName: string;
    secondLastName: string;
}

export type ServiceResponse = GetUserResponse | GetNamesResponse