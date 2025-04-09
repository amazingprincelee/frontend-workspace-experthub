export interface CourseType {
  _id: string;
  title: string;
  thumbnail: ThumbnailType | string;
  category: string;
  about: string;
  duration: number;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  fee: number;
  strikedFee: number;
  enrolledStudents: any[];
  resources: any[];
  videos: any[];
  [key: string]: any;
}
export interface CourseTypeSingle {
  _id: string
  title: string
  thumbnail: {
    type: string
    url: string
  }
  category: string
  meetingId: string
  meetingPassword: string
  zakToken: string
  about: string
  author: string
  authorId: string
  duration: number
  instructorName?: string
  mode: 'online' | 'offline'
  type: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  fee: number
  strikedFee: number
  target: number
  videoUrl: string
  days: {
    checked: boolean
    day: string
    startTime: string
    endTime: string
  }[]
  enrolledStudents: string[]
  location: string
  room: string
  benefits: string[]

}

export interface EventTypeSingle extends Omit<CourseTypeSingle, 'type'> {
  type: 'event'
}



export interface CategoryType {
  _id: string;
  category: string;
  subCategory: string[];
  [key: string]: any;
}

export interface ThumbnailType {
  type: string;
  url: string;
  [key: string]: any;
}