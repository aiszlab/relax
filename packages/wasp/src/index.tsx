#!/usr/bin/env node
import { Command } from "commander";
import { development } from "./modules/development";

const program = new Command();

program.command("dev").action(() => {
  development();
});

program.parse();
