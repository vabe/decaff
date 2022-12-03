export type Listing = {
  id: string;
  name: string;
  caption?: string;
  tags?: string[];
  media: Media;
  price: int;
  comments?: Comment[];
};

export type History = {
  userId: string;
  listingId: string;
  listing: Listing;
};

export type Media = {
  preview: number[];
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
