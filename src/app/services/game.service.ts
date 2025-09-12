import {ChangeDetectorRef, computed, effect, inject, Injectable, signal} from '@angular/core';
import {Player} from '../components/player-list/player-list.component';
import {downloadCsv, getOrCreate, isFrontRow, teamHasWonSet} from '../helper/Helper';
import {Actions} from '../components/court/court.component';
import {MatDialog} from '@angular/material/dialog';
import {PlayerDialogComponent} from '../components/player-dialog/player-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public readonly players = signal<Player[]>([{
    name: 'test',
    number: 1,
    isLibero: false
  }]);
  public readonly addPlayerDialogOpen = signal(false);

  public readonly correctModeActive = signal(false);

  public readonly previousSets = signal<(Action[])[]>([]);
  public readonly playerStats = signal<Map<number, PlayerStats>>(new Map());
  public readonly gameState = signal<ScoreboardState>({
    homeScore: 0,
    awayScore: 0,
    currentServer: 'home',
    currentSet: 1,
    homeSetsWon: 0,
    awaySetsWon: 0,
    rotation: Array(6).fill(null)
  });

  public readonly currentServer = computed(() => {
    return this.gameState().currentServer;
  })

  private readonly currentSet = computed(() => {
    return this.gameState().currentSet;
  })

  private readonly currentRotation = computed(() => {
    return this.gameState().rotation || [];
  })

  public readonly history = signal<Action[]>([]);

  public readonly matchTime = signal(0);
  private timerInterval: any = null;

  private readonly matchStatus = signal<'notStarted' | 'inProgress' | 'paused' | 'ended'>('notStarted');

  public readonly hasHistory = computed(() => this.history().length > 1);
  public readonly started = computed(() => this.matchStatus() === 'inProgress');
  public readonly paused = computed(() => this.matchStatus() === 'paused');
  public readonly notStarted = computed(() => this.matchStatus() === 'notStarted');

  constructor() {
    const saved = localStorage.getItem('players');
    if (saved) {
      this.players.set(JSON.parse(saved));
    }

    effect(() => {
      const current = this.players();
      localStorage.setItem('players', JSON.stringify(current));
    });
  }

  public recordPlayerAction(action: Actions, player: Player) {

    let summand = 1

    if(this.correctModeActive()) {
      summand = -1;
    }

    const statsMap = this.playerStats();
    let stats = getOrCreate(statsMap, player.number, () => ({
        playerNumber: player.number,
        playerName: player.name,
        hits: 0,
        kills: 0,
        attackErrors: 0,
        blocks: 0,
        aces: 0,
        serveErrors: 0
      }));

    switch(action) {
      case 'hit':
        stats.hits+=summand;
        break;
      case 'kill':
        stats.kills+=summand;
        break;
      case 'attackError':
        stats.attackErrors+=summand;
        break;
      case 'block':
        stats.blocks+=summand;
        break;
      case 'serveError':
        stats.serveErrors+=summand;
        break;
      case 'ace':
        stats.aces+=summand;
        break;
    }

    if(!this.correctModeActive()) {
      if(action === 'ace' || action === 'kill') {
        this.addPoint('home');
        return;
      }

      if (action === 'attackError' || action === 'serveError') {
        this.addPoint('away');
        return;
      }
    }

    this.playerStats.update(x => {
      x.set(player.number, stats);
      return x;
    });

  }

  public changeServingTeam() {
    if (this.started()) return;
    const newServer = this.currentServer() === 'home' ? 'away' : 'home';
    this.gameState.update(x => {
      return {
        ...x,
        currentServer: newServer
      };
    });
  }

  public addPoint(team: 'home' | 'away') {
    if (!this.started()) return;
    if (team === 'home') {
      const shouldRotate = this.currentServer() !== 'home';

      this.gameState.update(x => {
        return {
          ...x,
          homeScore: x.homeScore + 1,
          currentServer: team
        };
      });

      if(shouldRotate) {
        this.rotate();
      }

    } else {
     this.gameState.update(x => {
        return {
          ...x,
          awayScore: x.awayScore + 1,
          currentServer: team
        };
      });
    }

    const oldHistory = this.history();
    this.history.set([...oldHistory, {
      type: 'point',
      team: team,
      state: this.gameState(),
      timestamp: this.formattedTime()
    }]);

    const state = this.gameState();

     const homeWon = teamHasWonSet(state.homeScore, state.awayScore);
     const awayWon = teamHasWonSet(state.awayScore, state.homeScore);

     if (homeWon || awayWon) {
       const lastServer = this.history()[0].state.currentServer

       const initState = {
          homeScore: 0,
          awayScore: 0,
          currentServer: lastServer === 'home' ? "away" : "home",
          currentSet: this.currentSet() + 1,
          homeSetsWon: homeWon ? state.homeSetsWon + 1 : state.homeSetsWon,
          awaySetsWon: awayWon ? state.awaySetsWon + 1 : state.awaySetsWon,
          rotation: Array(6).fill(null)
       } as ScoreboardState;

       this.previousSets.update(x => [...x, this.history()]);
       this.stopMatch();

       this.gameState.set(initState);
     }
  }

  public undo() {
    if (!this.started()) return;
    this.history().pop();
    if (this.history().length > 1) {
      const lastAction = this.history()[this.history().length - 1];
      if (lastAction.state)
        this.gameState.set(lastAction.state);
    }
  }

  public setPlayer(player: Player, position: number) {

    if(this.notStarted()) {

      if (player.isLibero) {
        alert('Please set the libero position after the match has started.');
        return;
      }

      const current = [...this.currentRotation()];

      const oldPosition = current.findIndex(p => p?.number === player.number);
      if(oldPosition !== -1) current[oldPosition] = null;

      current[position] = player;
      this.gameState.update(x => {
        return {
          ...x,
          rotation: current
        };
      });

    }else if(this.started()){
      if(player.isLibero) {
        if(isFrontRow(position)) return;

        const current = [...this.currentRotation()];

        const containsLibero = current.find(p => p?.isLibero);
        if(containsLibero) return;

        const oldPlayer = current[position];
        if(oldPlayer) {
          if(oldPlayer.isLibero) return;

          player.liberoChangedFor = oldPlayer;

          current[position] = player;
          this.gameState.update(x => {
            return {
              ...x,
              rotation: current
            };
          });
        }
      }else {
        const current = [...this.currentRotation()];
        const oldPlayer = current[position];

        if(oldPlayer) {

          if(oldPlayer.PlayerChangedFor) {
            if(player.number !== oldPlayer.PlayerChangedFor.number) {
              alert("This position can only be changed back to the original player. Player " + oldPlayer.PlayerChangedFor.number);
            }else {
              current[position] = oldPlayer.PlayerChangedFor;
              oldPlayer.PlayerChangedFor = undefined;
              this.gameState.update(x => {
                return {
                  ...x,
                  rotation: current
                };
              });
            }
          }else {
            if (oldPlayer.isLibero) {
              if(oldPlayer.liberoChangedFor) {
                if(oldPlayer.liberoChangedFor.number !== player.number) {
                  alert("This position can only be changed back to the original player. Player " + oldPlayer.liberoChangedFor.number);
                  return;
                }else {
                  current[position] = oldPlayer.liberoChangedFor;
                  oldPlayer.liberoChangedFor = undefined;
                  this.gameState.update(x => {
                    return {
                      ...x,
                      rotation: current
                    };
                  });
                }

              }
            }else {
              player.PlayerChangedFor = oldPlayer;
              current[position] = player;
              this.gameState.update(x => {
                return {
                  ...x,
                  rotation: current
                };
              });
            }
          }
        }
        this.history.update(x => {
          return [...x, {
            type: 'playerChange',
            team: 'home',
            state: this.gameState(),
            timestamp: this.formattedTime()
          }];
        });
      }
    }
  }

  public startMatch() {
    if (this.started()) return;
    if(this.gameState().rotation.find(x => x === null) !== undefined) {
      alert('Please set all player positions before starting the match.');
      return;
    }
    if (!this.paused()) {
      this.history.set([
        {
          type: 'init',
          state: this.gameState(),
          team: null,
        }
      ]);
    }
    this.matchStatus.set('inProgress');
    this.timerInterval = setInterval(() => {
      this.matchTime.update(t => t + 1);
    }, 1000);
  }

  public pauseMatch() {
    if (!this.started()) return;
    this.matchStatus.set('paused');
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  public stopMatch() {
    this.matchStatus.set('notStarted');
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.history.set([]);

    this.matchTime.set(0);
  }

  public formattedTime() {
    const t = this.matchTime();
    const minutes = Math.floor(t / 60).toString().padStart(2, '0');
    const seconds = (t % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  private rotate() {
    const state = this.gameState();
    if (!state.rotation || state.rotation.length === 0) return;

    let current = [...state.rotation];

    const first = current.shift()!;
    current = [...current, first];

    const liberoIndex = current.findIndex(p => p?.isLibero);
    if(liberoIndex !== -1) {
      const libero = current[liberoIndex]!;
      if(libero.liberoChangedFor) {
        if(isFrontRow(liberoIndex)) {
          current[liberoIndex] = libero.liberoChangedFor;
          libero.liberoChangedFor = undefined;
          alert('Libero ' + libero.number + ' was exchanged for Player ' + current[liberoIndex]?.number);
        }
      }
    }

    this.gameState.update(x => {
      return {
        ...x,
        rotation: current,
        currentServer: 'home'
      };
    });
  }

  public addPlayer(player: Player) {
    this.players.set([...this.players(), player]);
  }

  public removePlayer(playerNumber: number) {
    this.players.set(this.players().filter(p => p.number !== playerNumber));
    this.playerStats.update(map => {
      map.delete(playerNumber);
      return map;
    });
  }


  public exportPreviousSetsCsv() {
    const sets = this.previousSets();

    if(this.started()) {
      sets.push(this.history())
    }

    const rows: any[] = [];

    sets.forEach((set, setIndex) => {
      set.forEach((action, i) => {
        rows.push({
          set: setIndex + 1,
          index: i + 1,
          type: action.type,
          team: action.team ?? '',
          timestamp: action.timestamp ?? '',
          homeScore: action.state.homeScore,
          awayScore: action.state.awayScore,
          currentServer: action.state.currentServer,
        });
      });
    });

    downloadCsv('match-history.csv', rows);
  }

  public exportPlayerStatsCsv() {
    const statsArray = Array.from(this.playerStats().values());

    const rows = statsArray.map(stat => ({
      playerNumber: stat.playerNumber,
      playerName: stat.playerName,
      hits: stat.hits,
      kills: stat.kills,
      attackErrors: stat.attackErrors,
      blocks: stat.blocks,
      aces: stat.aces,
      serveErrors: stat.serveErrors,
    }));

    downloadCsv('player-stats.csv', rows);
  }
}

export interface Action {
  type: 'point' | 'playerChange' | 'init';
  team?: 'home' | 'away' | null;
  state: ScoreboardState;
  timestamp?: string;
}

export interface ScoreboardState {
  homeScore: number;
  awayScore: number;
  currentServer: 'home' | 'away';
  currentSet: number;
  homeSetsWon: number;
  awaySetsWon: number;
  rotation: (Player | null)[];
}

export interface PlayerStats {
  playerNumber: number;
  playerName: string;

  hits: number;
  kills: number;
  attackErrors: number;

  blocks: number;

  aces: number;
  serveErrors: number;
}
