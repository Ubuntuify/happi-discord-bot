import { VoiceConnection } from 'discord.js';
import Client from '../../../Client';

export async function fetchConnection(client: Client, id: string) {
  const connectionFilter = (connection: VoiceConnection) =>
    connection.channel.id === id;

  if (!client.voice.connections.some(connectionFilter))
    throw new Error('Voice connection did not exist.');

  return client.voice.connections.filter(connectionFilter).first();
}
