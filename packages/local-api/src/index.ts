import path from "path";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  // setup express server
  const app = express();

  // route handlers for req to '/cells'
  app.use(createCellsRouter(filename, dir));

  // use proxy in dev mode
  if (useProxy) {
    // Dev mode: CRA dev server will also be available at port "http://localhost:4005"
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true, // web socket support
        logLevel: "silent",
      })
    );
  } else {
    // Prod mode (CLI installed): serve the built files of react app inside node_modules dependency
    const packagePath = require.resolve("local-client/build/index.html");
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
