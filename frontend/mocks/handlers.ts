import Chance from "chance";
import { rest } from "msw";
import { Listing } from "./types";

const c = new Chance();

function createListing(): Listing {
  return {
    id: c.guid(),
    name: c.word(),
    caption: c.paragraph(),
    tags: [c.word(), c.word(), c.word()],
  };
}

function createListingList(number: number): Listing[] {
  return Array.from({ length: number }, createListing);
}

export const handlers = [
  rest.get("/api/listings", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.json(createListingList(15)));
  }),
  rest.post("/api/listings", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(403));
  }),
];
