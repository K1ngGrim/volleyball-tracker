import {effect, Injectable, signal} from '@angular/core';
import {Player, PlayerPosition} from "../models/player";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  public readonly selectedPlayer = signal<Player | null>(null);
  public readonly rotation = signal<number>(0);

  public readonly players = signal<Player[]>([
    {
      name: 'Player 1',
      number: 1,
      position: PlayerPosition.OppositeHitter

    },
    {
      name: 'Player 2',
      number: 2,
      position: PlayerPosition.Libero
    },
    {
      name: 'Player 3',
      number: 3,
      position: PlayerPosition.MiddleBlocker
    },
    {
      name: 'Player 1',
      number: 4,
      position: PlayerPosition.OppositeHitter
    },
    {
      name: 'Player 2',
      number: 5,
      position: PlayerPosition.Libero
    },
    {
      name: 'Player 3',
      number: 6,
      position: PlayerPosition.MiddleBlocker
    },
    {
      name: 'Player 1',
      number: 7,
      position: PlayerPosition.OppositeHitter
    },
    {
      name: 'Player 2',
      number: 8,
      position: PlayerPosition.Libero
    },
    {
      name: 'Player 3',
      number: 9,
      position: PlayerPosition.MiddleBlocker
    }
  ]);

  constructor() {
    effect(() => {
      const current = this.players();
      localStorage.setItem('players', JSON.stringify(current));
    });
  }

  public addPlayer(player: Player) {
    this.players.set([...this.players(), player]);
  }

  public updatePlayer(oldPlayer: Player, updatedPlayer: Player) {
    this.players.set(this.players().map(p => p === oldPlayer ? updatedPlayer : p));
  }

  public removePlayer(playerNumber: number) {
    this.players.set(this.players().filter(p => p.number !== playerNumber));
    // this.playerStats.update(map => {
    //   map.delete(playerNumber);
    //   return map;
    // });
  }

}
