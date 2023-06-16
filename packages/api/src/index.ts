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

  router.get("/gps", async (ctx) => {
    const { lat, lng } = ctx.request.query;

    if (!lat || !lng) {
      throw new Error(`Last and Lng must be provided.`);
    }

    try {
      const placesResponse = await client.placesNearby({
        params: {
          location: {
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string),
          },
          keyword: "doctor",
          key: "AIzaSyC2CmhUmpXIxkcQubwX42E1GqlJ_YgcjtU",
          rankby: PlacesNearbyRanking.distance,
          type: "health",
        },
      });

      const places = placesResponse.data.results;
      const gps = places.map((place) => ({
        name: place.name,
        address: place.vicinity,
        location: place.geometry?.location,
      }));

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
