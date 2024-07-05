#!/usr/bin/env node
import { Command } from 'commander'
import { preinstall } from './preinstall.js'

const program = new Command()

/**
 * @description
 * check at preinstall
 */
program.command('preinstall').action(() => {
  preinstall()
})

program.parse()
