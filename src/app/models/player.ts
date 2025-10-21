export interface Player {
  number: number;
  name: string;
  playerChangedFor?: Player;
  position?: PlayerPosition;
}

export enum PlayerPosition {
  OutsideHitter = 'Outside Hitter',
  OppositeHitter = 'Opposite Hitter',
  MiddleBlocker = 'Middle Blocker',
  Setter = 'Setter',
  Libero = 'Libero',
}
