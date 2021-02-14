import express from "express";

export const serve = (port: number, filename: string, dir: string) => {
  // setup express server
  const app = express();

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
