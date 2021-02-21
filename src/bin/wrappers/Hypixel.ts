/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import { Client } from 'hypixel-api-reborn';
import { MessageEmbed, Message } from 'discord.js';

const APIErrorMessage = new MessageEmbed().setDescription(
  [
    'An API error has occured while retrieving from the Hypixel API. If this persists, you should report this error.\n',
    'However, it is more likely that you did not provide a player that has logged on the server. You can verify this by going on plancke.io to check the API.',
    'If you did not ask for a player, this is a problem on our side. You can check the git repository to see the error.',
  ].join('\n')
);

export class HypixelAPI extends Client {
  constructor(key: string) {
    super(key, {
      cache: true,
      cacheTime: 5,
    });
  }

  /**
   * Creates a personal embed for the player.
   * @param {String} query - The query (player) that was asked.
   * @returns {MessageEmbed} - Embed generated from this method.
   */
  async createEmbedPlayer(query: string): Promise<MessageEmbed> {
    try {
      const playerData = {
        player: await super.getPlayer(query),
        playerStatus: await super.getStatus(query),
      };

      const playerName =
        playerData.player.rank === 'Default'
          ? playerData.player.nickname
          : `[${playerData.player.rank}] ${playerData.player.nickname}`;

      const playerStatus = playerData.player.isOnline
        ? playerData.playerStatus.mode
        : 'OFFLINE';

      return new MessageEmbed()
        .setAuthor(
          `Player • ${playerName}`,
          `https://fsa.zobj.net/crop.php?r=by0jGANgnc4W22sOr9z4e9V-f5s5J9Ud5UMMEyggbnr0Mr3JYYoK16DCVlQulNDLSO6xrestaTY37IUXFdx5A-h1LOgW6zaWU03pvnFnVw-6C37MyBorvI6Fc-qdaFTVsjNzrGm-ZcZDSmu4`,
          `https://hypixel.net`
        )
        .addFields(
          {
            name: 'Status',
            value: `\`${playerStatus}\``,
            inline: true,
          },
          {
            name: 'Level',
            value: `\`${playerData.player.level}\``,
            inline: true,
          },
          {
            name: 'Karma',
            value: `\`${playerData.player.karma}\``,
            inline: true,
          },
          {
            name: 'Version',
            value: `\`${playerData.player.mcVersion}\``,
            inline: true,
          },
          {
            name: 'Gifts Given',
            value: `\`${playerData.player.giftsSent}\``,
            inline: true,
          },
          {
            name: 'Gifts Received',
            value: `\`${playerData.player.giftsReceived}\``,
            inline: true,
          },
          {
            name: 'First Login',
            value: `\`${formatDate(playerData.player.firstLogin)}\``,
            inline: true,
          },
          {
            name: 'Last Login',
            value: `\`${formatDate(playerData.player.lastLogin)}\``,
            inline: true,
          },
          {
            name: 'Name History',
            value: playerData.player.history.join(', '),
            inline: false,
          }
        );
    } catch (stacktrace) {
      return APIErrorMessage;
    }
  }

  /**
   * Creates a personal embed for the queried guild.
   * @param {String} query - The query (guild) that was asked.
   * @returns {MessageEmbed} - Embed generated from this method.
   */
  async createEmbedGuild(query: any): Promise<MessageEmbed> {
    try {
      const guildData = await super.getGuild(query, query);

      return new MessageEmbed()
        .setAuthor(
          `Guild • ${guildData.name}`,
          `https://fsa.zobj.net/crop.php?r=by0jGANgnc4W22sOr9z4e9V-f5s5J9Ud5UMMEyggbnr0Mr3JYYoK16DCVlQulNDLSO6xrestaTY37IUXFdx5A-h1LOgW6zaWU03pvnFnVw-6C37MyBorvI6Fc-qdaFTVsjNzrGm-ZcZDSmu4`,
          `https://hypixel.net`
        )
        .addFields(
          {
            name: 'Description',
            value: guildData.description,
            inline: false,
          },
          {
            name: 'Level',
            value: `${guildData.level}`,
            inline: true,
          },
          {
            name: 'Created At',
            value: `${formatDate(guildData.createdAt)}`,
            inline: true,
          }
        );
    } catch (stacktrace) {
      return APIErrorMessage;
    }
  }

  /**
   * Creates a personal embed for Watchdog Statistics.
   * @returns {MessageEmbed} - Embed generated from this
   */
  async createEmbedWatchdog(): Promise<MessageEmbed> {
    try {
      const stats = await this.getWatchdogStats();

      return new MessageEmbed().setTimestamp().addFields(
        {
          name: 'Watchdog\nTotal Bans⠀⠀⠀',
          value: stats.byWatchdogTotal,
          inline: true,
        },
        {
          name: '⠀\nLast Min⠀⠀⠀',
          value: stats.byWatchdogLastMinute,
          inline: true,
        },
        {
          name: '⠀\nDaily Bans⠀⠀⠀',
          value: stats.byWatchdogRollingDay,
          inline: true,
        },
        {
          name: 'Staff\nTotal Bans⠀⠀⠀',
          value: stats.byStaffTotal,
          inline: true,
        },
        {
          name: '⠀\nDaily Bans⠀⠀⠀',
          value: stats.byStaffRollingDay,
          inline: true,
        },
        { name: '⠀', value: '⠀', inline: true }
      );
    } catch (stacktrace) {
      return APIErrorMessage;
    }
  }

  /**
   * Generates an embed for Bedwars Stats.
   * @param {String} query - The query (player) that was asked.
   * @returns {MessageEmbed} - Embed generated from this method.
   */
  async createEmbedPlayerBedwars(query: string): Promise<MessageEmbed> {
    try {
      const player = await super.getPlayer(query);
      const { bedwars } = player.stats;

      // 📡 Subsitutes not available statistics.
      const avgDeaths =
        Math.round((bedwars.deaths / bedwars.playedGames) * 100) / 100;
      const AKDRatio = Math.round((bedwars.avg.kills / avgDeaths) * 100) / 100;
      const lastOnline = player.isOnline
        ? '`ONLINE`'
        : formatDate(player.lastLogin);

      return new MessageEmbed()
        .setAuthor(
          `BedWars Stats • [${bedwars.level}✫] ${player.nickname}`,
          `https://fsa.zobj.net/crop.php?r=by0jGANgnc4W22sOr9z4e9V-f5s5J9Ud5UMMEyggbnr0Mr3JYYoK16DCVlQulNDLSO6xrestaTY37IUXFdx5A-h1LOgW6zaWU03pvnFnVw-6C37MyBorvI6Fc-qdaFTVsjNzrGm-ZcZDSmu4`,
          `https://hypixel.net`
        )
        .addFields(
          // ✨ Kill and deaths - KDR
          { name: 'Total\nKills', value: bedwars.kills, inline: true },
          { name: '⠀\nDeaths', value: bedwars.deaths, inline: true },
          { name: '⠀\nKDR', value: bedwars.KDRatio, inline: true },

          // ✨ Average kill and average deaths - AKDR
          {
            name: 'Average\nKills⠀⠀⠀⠀⠀⠀⠀⠀',
            value: bedwars.avg.kills,
            inline: true,
          },
          {
            name: '⠀\nDeaths⠀⠀⠀⠀⠀',
            value: avgDeaths,
            inline: true,
          },
          {
            name: '⠀\nAKDR⠀⠀⠀',
            value: AKDRatio,
            inline: true,
          },

          // ✨ Final kills and final deaths - FKDR
          { name: 'Final\nKills', value: bedwars.finalKills, inline: true },
          { name: '⠀\nDeaths', value: bedwars.finalDeaths, inline: true },
          { name: '⠀\nFKDR', value: bedwars.finalKDRatio, inline: true },

          // ✨ Beds broken and beds lost - BBBLR
          { name: 'Beds\nBroken', value: bedwars.beds.broken, inline: true },
          { name: '⠀\nLost', value: bedwars.beds.lost, inline: true },
          { name: '⠀\nBBBLR', value: bedwars.beds.BLRatio, inline: true },

          // ✨ Wins and Losses - WLR
          { name: 'Wins', value: bedwars.wins, inline: true },
          { name: 'Losses', value: bedwars.losses, inline: true },
          { name: 'WLR', value: bedwars.WLRatio, inline: true },

          {
            name: 'Collected\nIron',
            value: bedwars.collectedItemsTotal.iron,
            inline: true,
          },
          {
            name: '⠀\nGold',
            value: bedwars.collectedItemsTotal.gold,
            inline: true,
          },
          {
            name: '⠀\nDiamond',
            value: bedwars.collectedItemsTotal.diamond,
            inline: true,
          },
          {
            name: 'Emerald',
            value: bedwars.collectedItemsTotal.emerald,
            inline: true,
          },

          // ✨ Other stats.
          { name: 'Time since last online.', value: lastOnline, inline: false },
          { name: 'Current winstreak', value: bedwars.winstreak, inline: true }
        )
        .setThumbnail(
          'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'
        );
    } catch (stacktrace) {
      return APIErrorMessage;
    }
  }
}

/**
 * This function formats the date. It is used in embed creation functions.
 * @param {Date} Date - The date to be formatted into a string.
 */
function formatDate(Date: Date): string {
  // eslint-disable-next-line
  return [Date.getMonth() + 1, Date.getDate(), Date.getFullYear()].join('/') +
    ' ' +
    // eslint-disable-next-line prettier/prettier
  [Date.getHours(), Date.getMinutes(), Date.getSeconds()].join(':');
}
