import Chance from "chance";
import { rest } from "msw";
import { Account, Comment, Listing, UserCommentOwner } from "./types";

const c = new Chance();

function createUserCommentOwner(): UserCommentOwner {
  return {
    name: c.name(),
    id: c.guid(),
  };
}

function createComment(): Comment {
  return {
    id: c.guid(),
    content: c.paragraph(),
    createdAt: c.date(),
    updatedAt: c.date(),
    listingId: c.guid(),
    userId: c.guid(),
    user: createUserCommentOwner(),
  };
}

function createCommentList(number: number): Comment[] {
  return Array.from({ length: number }, createComment);
}

function createListingWithComments(): Listing {
  return {
    id: c.guid(),
    name: c.word(),
    caption: c.paragraph(),
    tags: [c.word(), c.word(), c.word()],
    preview: c.word(),
    comments: createCommentList(c.integer({ min: 1, max: 20 })),
  };
}

function createListing(): Listing {
  return {
    id: c.guid(),
    name: c.word(),
    caption: c.paragraph(),
    tags: [c.word(), c.word(), c.word()],
    preview: c.word(),
  };
}

function createListingList(number: number): Listing[] {
  return Array.from({ length: number }, createListing);
}

function createAccount(): Account {
  return {
    name: c.name(),
    email: c.email(),
  };
}

export const handlers = [
  rest.get("/api/listings", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.json(createListingList(15)));
  }),
  rest.post("/api/listings", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(403));
  }),
  rest.get("/api/listings/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.json(createListingWithComments()));
  }),
  rest.post("/api/listings/:id/comments", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(201));
  }),
  rest.get("/api/history/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.json(createListingList(15)));
  }),
  rest.get("/api/account", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.json(createAccount()));
  }),
  rest.post("/api/account", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(204));
  }),
];
