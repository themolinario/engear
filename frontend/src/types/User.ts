export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  subscribers: number;
  subscribedUsers: IUser[],
  streamedTimeTotal: number,
  streamedData: number,
  rebufferingEvents: number,
  rebufferingTime: number,
  roles: string[]

}