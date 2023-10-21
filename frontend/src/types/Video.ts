export interface IVideo {
  _id?: string;
  userId: string;
  title: string;
  desc: string;
  imgUrl: string;
  videoUrl: string;
  views: number;
  streamedTimeTotal: number,
  tags: string[];
  likes: string[];
  dislikes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IUpdateStreamDataTotalVariables {
  id?: string,
  playedSeconds: number
}