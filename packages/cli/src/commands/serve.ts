import { Command } from "commander";
import { serve } from "local-api";

export const serveCommand = new Command()
  // [filename] is an optional value
  .command("serve [filename]")
  .description("Open a file for editing")
  // <number> is a required value, 4005 is default value
  .option("-p, --port <number>", "port to run server on", "4005")
  .action((filename = "notebook.js", options: { port: string }) => {
    // calling local-api package
    serve(parseInt(options.port), filename, "/");
  });
