import path from "path";
import { Command } from "commander";
import { serve } from "@jsnote-joe/local-api";

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  // [filename] is an optional value
  .command("serve [filename]")
  .description("Open a file for editing")
  // <number> is a required value, 4005 is default value
  .option("-p, --port <number>", "port to run server on", "4005")
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      // get absolute path of file arg
      const dir = path.join(process.cwd(), path.dirname(filename));
      // calling local-api package
      await serve(parseInt(options.port), path.basename(filename), dir, !isProduction);
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file`
      );
    } catch (err) {
      if (err.code === "EADDRINUSE") {
        console.error("Port is in use. Try running on a differernt port");
      } else {
        console.log("Here is the problem", err.message);
      }
      process.exit(1);
    }
  });
