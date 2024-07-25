export interface IUserServiceImpl{
    getUserWalletAmount(token: string): Promise<number | null> 
}