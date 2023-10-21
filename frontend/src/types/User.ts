export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  subscribers: number;
  subscribedUsers: IUser[],
  streamedTimeTotal: number,
  rebufferingEvents: number,
  rebufferingTime: number

}