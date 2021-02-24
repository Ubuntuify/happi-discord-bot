/* eslint-disable prettier/prettier */
import { Message } from 'discord.js';
import { Interface } from '../../../../Client';

const BaseCommand = require('../../Command').default;

module.exports = class RngCommand extends BaseCommand {
  constructor( client: Interface, name: string ) {
    super( client, name, {
      category: 'Fun',
      description: 'Generates a random number between your provided arguments.',
      args: true,
      usage: '<min num> <max num>',
      timing: 10,
      ownerOnly: false,
    } );
  }

  // eslint-disable-next-line
  async run( message: Message, args: string[] ): Promise<void> {
    const regExp: RegExp = /[a-zA-z]/g;

    if ( regExp.test(args[0]) || regExp.test(args[1]) ) {
      message.channel.send('This request contains illegal characters. Please request with proper characters.');
      return;
    }

    const minRNG: number = Number(args[0]);
    const maxRNG: number = Number(args[1]);

    const actualMax: number = maxRNG - minRNG;

    if (maxRNG < minRNG) {
      message.channel.send(`We can't handle a number from \`${minRNG}-${maxRNG}\`. What? The only thing in that range is \`undefined\`.`);
      return;
    };

    const random: number = maxRNG === minRNG ? minRNG: Math.floor( Math.random() * actualMax ) + 1 + minRNG;
    message.channel.send(`The random number generated was \`${random}\`. The range you specified was \`${minRNG}-${maxRNG}\`.`);
  };
}