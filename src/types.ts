export interface SpamReport {
  id: string;
  number: string;
  type: string;
  message: string;
  timestamp: string | Date;
}

export interface Stats {
  blockedToday: number;
  activeAttacks: number;
  topSpamNumbers: {
    number: string;
    score: number;
    reports: number;
    type: string;
  }[];
}
