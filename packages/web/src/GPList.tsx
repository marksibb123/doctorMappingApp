import http from "http";
import Router from "@koa/router";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import {
  Client,
  PlacesNearbyRanking,
} from "@googlemaps/google-maps-services-js";

async function serve(app: Koa): Promise<void> {
  return new Promise<void>((resolve) => {
    const port = 3000;
    const listener = http.createServer(app.callback());
    listener.on("close", resolve);
    listener.listen(port);

    console.info(`API available on port http://localhost:${port}`);

    process.on("SIGINT", () => {
      console.info("trapped SIGINT, terminating");
      listener.close();
    });
  });
}

export const runServer = async (): Promise<void> => {
  const app = new Koa();

  app.use(bodyParser());
  app.use(cors());

  const router = new Router();

  const client = new Client({});

  async function fetchPlaces(lat: number, lng: number, pageToken?: string, collectedPlaces: any[] = []): Promise<any[]> {
    const response = await client.placesNearby({
      params: {
        location: { lat, lng },
        keyword: "doctor",
        key: "AIzaSyAkMDHxwIxN_S9g1S1KzfUW4ZjEIq6uq5Q",
        rankby: PlacesNearbyRanking.distance,
        type: "health",
        pagetoken: pageToken,
      },
    });

    collectedPlaces = collectedPlaces.concat(response.data.results);

    if (response.data.next_page_token && collectedPlaces.length < 60) {
      // Wait for a short delay then fetch the next page of results
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchPlaces(lat, lng, response.data.next_page_token, collectedPlaces);
    } else {
      return collectedPlaces.slice(0, 60);
    }
  }

  router.get("/gps", async (ctx) => {
    const { lat, lng } = ctx.request.query;

    if (!lat || !lng) {
      throw new Error(`Last and Lng must be provided.`);
    }

    try {
      const gps = await fetchPlaces(parseFloat(lat as string), parseFloat(lng as string));
      ctx.body = gps;
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  });

  app.use(router.routes()).use(router.allowedMethods());

  await serve(app);
};

runServer().then(
  (): void => {
    process.exit(0);
  },
  (e): void => {
    console.error(e);
    process.exit(1);
  }
);
