# Frontend UI of the Seattle Building Data Visualization app

## Getting Started

First, run the development server:

```bash
# local development
npm run dev
```

```sh
# docker

# pull from Docker Hub
docker pull mainekwok97/seattle-frontend

# use mount
docker run --rm -p 3000:3000 mainekwok97/seattle-frontend

# use docker-compose
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### User Interface

- The application consists of 3 pages: `Login`, `Overview` and `Chart`

- Unauthenticated users cannot visit `Overview` and `Chart`, authenticated users will be redirected to `Overview` if they visit `Login`

- `Login` page allows user to sign in using the credentials specified in backend. Users are allowed to sign out once they are authenticated

- `Overview` page allows user to browse list of `buildings` data fetched from API and support any forms of paging

- `Chart` page displays a bar chart showing the `average_eui` by `PrimaryPropertyType`
