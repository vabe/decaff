export type Listing = {
  id: string;
  name: string;
  caption?: string;
  tags?: string[];
  media: Media
  comments?: Comment[];
};

export type Media = {
  preview: number[]
};

export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  listingId: string;
  userId: string;
  user: UserCommentOwner;
};

export type UserCommentOwner = {
  id: string;
  name: string;
};

export type Account = {
  name: string;
  email: string;
};
