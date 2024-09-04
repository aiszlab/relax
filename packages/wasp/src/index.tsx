#!/usr/bin/env node
import { Command } from "commander";
import { development } from "./libs/development.js";
import { build } from "./libs/build.js";

const program = new Command();

program.command("dev").action(() => {
  development();
});

program.command("build").action(() => {
  build();
});

program.parse();
