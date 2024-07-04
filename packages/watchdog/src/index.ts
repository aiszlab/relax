#!/usr/bin/env node
import { Command } from 'commander'
import { preinstall } from './preinstall'

const program = new Command()

/**
 * @description
 * check at preinstall
 */
program.command('preinstall').action((options) => {})

/**
 * 发布 npm 包
 */
program.command('release').action(() => {
  preinstall()
})

program.parse()
