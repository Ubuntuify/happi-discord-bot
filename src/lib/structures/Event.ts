import Client from '../../Client';

/**
 * A simple implementation object the defines the Event Options.
 */
interface EventOptions {
  once?: Boolean;
  emitter?: any;
}

export default abstract class BaseEvent {
  /* 📚 The properties of this class. */
  public name: string;
  public client: Client;
  public type: string;
  public emitter: any;

  /* 🔨 The constructor for this class. */
  constructor(client: Client, name: string, options: EventOptions = {}) {
    this.client = client;
    this.name = name;
    this.type = options.once ? 'once' : 'on';
    this.emitter =
      (typeof options.emitter === 'string'
        ? this.client[options.emitter]
        : options.emitter) || this.client;
  }

  /* eslint-disable-next-line */
  public async run(...args: any): Promise<void> {
    throw new Error('This run method was not implemented successfully.');
  }
}
