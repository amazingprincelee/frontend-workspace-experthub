export interface ResourceType {
  _id: string;
  title: string;
  image: string;
  websiteUrl: string;
  aboutCourse: string;
  [key: string]: any;
}

export interface NoticeType {
  _id: string;
  title: string;
  body: string;
  link: string;
  action: string;
  page: string;
  cancel: Boolean;
  thumbnail: ThumbnailType
}
export interface ThumbnailType {
  type: string;
  url: string;
  [key: string]: any;
}