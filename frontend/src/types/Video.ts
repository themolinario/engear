export interface IVideo {
    _id?: string;
    userId: string;
    title: string;
    desc: string;
    imgUrl: string;
    videoUrl: string;
    views: number;
    tags: string[];
    likes: string[];
    dislikes: string[];
    createdAt?: string;
    updatedAt?: string;
}