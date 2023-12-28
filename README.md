# Globe Graph

This project scrapes flight route data from [FLightsFrom.com](https://www.flightsfrom.com/) and displays as a graph using [sigma.js](http://sigmajs.org/).

## Backend

The backend has 2 commands:

- `yarn scrape` - Scrapes the data from [FLightsFrom.com](https://www.flightsfrom.com/) and saves it to a redis database.
- `yarn graph` - Converts the data in the redis database to a [Graphology](https://graphology.github.io/) graph and saves it to a `graph.json` file.

You can the the airport from which the scraper starts by changing the line 76 in `src/scraper.js`:

```js
scrape("ARN");
```

## Frontend

The frontend is a simple [vite.js](https://vitejs.dev/) based Vanilla JS app that uses [sigma.js](http://sigmajs.org/) to display the graph.

Simply copy the `graph.json` file from the backend to the `src` folder, rename it to `data.json` and run `yarn dev` to start the dev server.

## Requisites

- [Docker Compose](https://docs.docker.com/compose/install/) To run the redis database from the `docker-compose.yml` file.
- [Node.js](https://nodejs.org/en/) To run the backend and frontend.
- [Yarn](https://yarnpkg.com/) To install the dependencies and run the commands.
