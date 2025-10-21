import {effect, Injectable, signal} from '@angular/core';
import {Player, PlayerPosition} from "../models/player";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  public readonly selectedPlayer = signal<Player | null>(null);
  public readonly players = signal<Player[]>([

  ]);

  constructor() {
    effect(() => {
      const current = this.players();
      localStorage.setItem('players', JSON.stringify(current));
    });
  }

  public importPlayerFromExistingList(key: string) {
    this.players.set(PlayerLists.get(key.toUpperCase())??[])
  }

  public addPlayer(player: Player) {
    this.players.set([...this.players(), player]);
  }

  public updatePlayer(oldPlayer: Player, updatedPlayer: Player) {
    this.players.set(this.players().map(p => p === oldPlayer ? updatedPlayer : p));
  }

  public removePlayer(playerNumber: number) {
    this.players.set(this.players().filter(p => p.number !== playerNumber));
  }

}

export const PlayerLists = new Map<string, Player[]>([
  ["PSKH3",
  [
    {
      name: 'Ramin Eslami',
      number: 1,
      position: PlayerPosition.Setter
    },
    {
      name: 'David Midle',
      number: 2,
      position: PlayerPosition.Setter
    },
    {
      name: 'Raffael de Araujo',
      number: 3,
      position: PlayerPosition.OppositeHitter
    },
    {
      name: 'Florian Kaiser',
      number: 5,
      position: PlayerPosition.OutsideHitter
    },
    {
      name: 'Frederik Hille',
      number: 7,
      position: PlayerPosition.MiddleBlocker
    },
    {
      name: 'Kevin Campione',
      number: 8,
      position: PlayerPosition.MiddleBlocker
    },
    {
      name: 'Ian Tuero',
      number: 9,
      position: PlayerPosition.MiddleBlocker
    },
    {
      name: 'Julius Wittorski',
      number: 11,
      position: PlayerPosition.OutsideHitter
    },
    {
      name: 'Martin Erndwein',
      number: 12,
      position: PlayerPosition.Libero
    },
    {
      name: 'Tim Knöpfle',
      number: 15,
      position: PlayerPosition.OutsideHitter
    },
    {
      name: 'Jannik Jessen',
      number: 20,
      position: PlayerPosition.MiddleBlocker
    }
  ]
  ],
]);
