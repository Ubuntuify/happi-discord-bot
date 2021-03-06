/* 💫 interfaces that Client.ts uses. */
export interface MojangResponsePlayer {
  name: string;
  id: string;
}

export interface HypixelResponse {
  '/key': {
    success: boolean;
    cause?: string;
    record?: {
      key?: string;
      owner?: string;
      limit?: number;
      queriesInPastMin?: number;
      totalQueries?: number;
    };
  };
  '/player': {
    success: boolean;
    cause?: string;
    player?: {
      uuid?: string;
      displayname?: string | null;
      rank?: ('ADMIN' | 'MODERATOR' | 'HELPER' | 'NORMAL') | null;
      packageRank?: ('MVP_PLUS' | 'MVP' | 'VIP_PLUS' | 'VIP' | 'NONE') | null;
      newPackageRank?:
        | ('MVP_PLUS' | 'MVP' | 'VIP_PLUS' | 'VIP' | 'NONE')
        | null;
      monthlyPackageRank?: ('SUPERSTAR' | 'NONE') | null;
      firstLogin?: number | null;
      lastLogin?: number | null;
      lastLogout?: number | null;
      stats?: { [key: string]: any } | null;
    };
  };
  '/friends': {
    success: boolean;
    cause?: string;
    uuid?: string;
    records?: {
      _id?: string;
      uuidSender?: string;
      uuidReceiver?: string;
      started?: number;
    }[];
  };
  '/recentgames': {
    success: boolean;
    uuid?: string;
    games?: {
      date?: number;
      gameType?: string;
      mode?: string;
      map?: string;
      ended?: number;
    }[];
  };
  '/status': {
    success: boolean;
    uuid?: string;
    session?: {
      online?: boolean;
      gameType?: string;
      mode?: string;
      map?: string;
    };
  };
  '/guild': {
    success: boolean;
    guild?: { [key: string]: any };
  };
}
