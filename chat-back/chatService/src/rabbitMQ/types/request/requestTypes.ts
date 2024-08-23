export interface BaseMessage {
  serviceType: string;
}

  
  export interface GetUserRequestMessage extends BaseMessage {
    serviceType: 'getUser';
    data: {
      firstName: string;
      lastName: string;
    };
  }
  
  export interface GetNamesRequestMessage extends BaseMessage {
    serviceType: 'getNames';
    data: {
      id: string;
    };
  }
  
  export type ServiceMessage = GetUserRequestMessage | GetNamesRequestMessage;
  