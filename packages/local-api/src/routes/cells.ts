import path from "path";
import express from "express";
import fs from "fs/promises";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();

  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      // Parse a list of cells out of it
      // Send list of cells back to browser
      res.send(JSON.parse(result));
    } catch (err) {
      // If read throws an error, see if the file doesn't exist
      if (err.code === "ENOENT") {
        // If not exit, add code to create a file with empty array as default cells
        await fs.writeFile(fullPath, "[]", "utf-8");
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // Take the list of cells fro mrequest obj
    // Serialize them
    const { cells }: { cells: Cell[] } = req.body;
    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");
    res.send({ status: "ok" });
  });

  return router;
};
