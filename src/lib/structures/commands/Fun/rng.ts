/* eslint-disable prettier/prettier */
import { Message } from 'discord.js';

const BaseCommand = require('../../Command').default;

module.exports = class RngCommand extends BaseCommand {
  constructor( client: any, name: string ) {
    super( client, name, {
      category: 'Fun',
      description: 'Generates a random number between your provided arguments.',
      args: true,
      usage: '.min num. .max num.',
      timing: 10,
      ownerOnly: false,
    } );
  }

  // eslint-disable-next-line
  async run( message: Message, args: string[] ) {
    const minRNG: number = Number(args[0]);
    const maxRNG: number = Number(args[1]);

    const actualMax: number = maxRNG - minRNG;

    const random = Math.floor( Math.random() * actualMax ) + 1 - minRNG;

    message.channel.send(`The random number generated was \`${random}\`.`);
  };
}