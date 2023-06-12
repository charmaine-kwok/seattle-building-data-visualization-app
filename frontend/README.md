# Frontend UI of the Seattle Building Data Visualization app

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### User Interface

- The application consists of 3 pages: `Login`, `Overview` and `Chart`

- Unauthenticated users cannot visit `Overview` and `Chart`, authenticated users will be redirected to `Overview` if they visit `Login`

- `Login` page allows user to sign in using the credentials specified in backend. Users are allowed to sign out once they are authenticated

- `Overview` page allows user to browse list of `buildings` data fetched from API and support any forms of paging

- `Chart` page displays a bar chart showing the `average_eui` by `PrimaryPropertyType`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!