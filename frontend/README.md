This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## ⚙️ Prerequisites

To run the application, the following is required:

- node (tested with `v16.15.0`)
- yarn (tested with `1.22.5`)

## ⏳ Installation

First, set up a development `.env.local` file with a single value:

```bash
NEXT_PUBLIC_MOCKING=false
NEXT_PUBLIC_BACKEND_API_URI=http://localhost:3010/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=/jUjRItg9j4lcVT8tSa7sD3Bwv5DKFuZCFS5QvIYuaI=
NEXT_PUBLIC_MAX_FILE_SIZE=25000000
```

> Upon deployment, a new secret should be generated, and the `NEXTAUTH_URL` value should be replaced to point to the deployment URL.
> A new secret can easily be generated using the following command:
>
> ```
> openssl rand -base64 32
> ```

Then run the following installation command from the root directory:

```bash
yarn install
```

Finally, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## 📖 Learn more

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## 📚 References

- [MUI](https://mui.com/): comprehensive suite of UI tools and components, highly customizable
- [ReactQuery](https://tanstack.com/query/v4/): asynchronous state management that supports [stale-while-revalidate](https://www.rfc-editor.org/rfc/rfc5861#section-3) caching mechanism
- [axios](https://axios-http.com/): promise-based HTTP client
- [lodash](https://lodash.com/): JS utility library
- [msw](https://mswjs.io/): next generation mocking that intercepts requests on the network level
- [prettier](https://prettier.io/): opinionated code formatter
