export type Listing = {
  id: string;
  name: string;
  caption?: string;
  tags?: string[];
  preview?: string;
  comments?: Comment[];
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
