import {computed, Injectable, signal} from '@angular/core';
import {downloadCsv, getOrCreate, isFrontRow} from '../helper/Helper';
import {Actions} from '../components/court/court.component';
import {Player, PlayerPosition} from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //refactored GameService

  public readonly playerStats = signal<Map<number, PlayerStats>>(new Map());
  public readonly gameState = signal<ScoreboardState>({
    homeScore: 0,
    awayScore: 0,
    currentServer: 'home',
    currentSet: 0,
    homeSetsWon: 0,
    awaySetsWon: 0,
    rotation: Array(6).fill(null)
  });

  public readonly redoStack = signal<ScoreboardState[]>([]);

  private readonly homeSiteRight = signal(false);

  // History of completed sets (each entry is a full copy of the sets full history)
  private readonly previousSets = signal<ScoreboardState[][]>([]);

  // History of completed sets (each entry is a full copy of the game state at the end of the set)
  public readonly setHistory = signal<ScoreboardState[]>([]);
  public readonly correctModeActive = signal(false);

  public readonly matchTime = signal(0);
  private timerInterval: any = null;

  private readonly matchStatus = signal<'notStarted' | 'inProgress' | 'paused' | 'ended'>('notStarted');

  public readonly started = computed(() => this.matchStatus() === 'inProgress');
  public readonly paused = computed(() => this.matchStatus() === 'paused');
  public readonly notStarted = computed(() => this.matchStatus() === 'notStarted');

  public readonly isHomeRightSide = computed(() => this.homeSiteRight());

  public readonly currentServer = computed(() => {
    return this.gameState().currentServer;
  });

  private readonly currentSet = computed(() => {
    return this.gameState().currentSet;
  });

  private readonly currentRotation = computed(() => {
    return this.gameState().rotation || [];
  });

  public startMatch() {
    if (this.started()) return;
    if(this.gameState().rotation.find(x => x === null) !== undefined) {
      alert('Please set all player positions before starting the match.');
      return;
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

    this.matchTime.set(0);
  }

  public changeSides() {
    this.homeSiteRight.update(x => !x);
  }

  public changeServiceTeam() {
    if (this.started() && !this.correctModeActive()) return;

    this.gameState.update(x => {
      return {
        ...x,
        currentServer: x.currentServer === 'home' ? 'away' : 'home'
      }
    });
  }


  public updateSetPoints(team: 'home' | 'away', correctionMode: -1 | 1 | null = null) {
    let state = this.gameState();
    if (this.started() && !correctionMode) {
      //current state (as a reference)

      this.setHistory.update(x => {
        return [...x, structuredClone(this.gameState())];
      });

      this.redoStack.set([]);

      const hasToRotate = state.currentServer !== team && team == 'home';

      state = {
        ...state,
        homeScore: team == 'home' ? state.homeScore + 1 : state.homeScore,
        awayScore: team == 'away' ? state.awayScore + 1 : state.awayScore,
        currentServer: team
      }

      const pointDifference = state.homeScore - state.awayScore;

      this.gameState.set(state);

      if (Math.abs(pointDifference) >= 2 && (state.homeScore >= 25 || state.awayScore >= 25)) {
        // Set is won
        const homeWon = pointDifference > 0;

        const lastServer = this.setHistory()[0].currentServer

        const initState = {
          homeScore: 0,
          awayScore: 0,
          currentServer: lastServer === 'home' ? "away" : "home",
          currentSet: this.currentSet() + 1,
          homeSetsWon: homeWon ? state.homeSetsWon + 1 : state.homeSetsWon,
          awaySetsWon: !homeWon ? state.awaySetsWon + 1 : state.awaySetsWon,
          rotation: Array(6).fill(null)
        } as ScoreboardState;

        this.previousSets.update(x => [...x, structuredClone(this.setHistory())]);
        this.stopMatch();

        this.gameState.set(initState);


      }

      if (hasToRotate) this.rotate();
    }else if (this.correctModeActive() && correctionMode) {
      state = {
        ...state,
        homeScore: team == 'home' ? state.homeScore + correctionMode : state.homeScore,
        awayScore: team == 'away' ? state.awayScore + correctionMode : state.awayScore,
      }

      this.gameState.set(state);
    }
  }

  public undo() {
    if (!this.started()) return;

    if (this.setHistory().length > 1) {
      const state = structuredClone(this.gameState());
      this.redoStack.update(x => {
        return [...x, state];
      });
      const latest = this.setHistory().pop();

      if (!latest) return;

      this.gameState.set(latest);
    }
  }

  public redo() {
    if (!this.started()) return;

    if (this.redoStack().length > 0) {
      const state = structuredClone(this.gameState());
      this.setHistory.update(x => {
        return [...x, state];
      });

      const newState = this.redoStack().pop();
      if (!newState) return;

      this.gameState.set(newState);
    }
  }

  public setPlayer(player: Player, position: number) {
    if(this.notStarted()) {

      if (player.position == PlayerPosition.Libero) {
        alert('Please set the libero position after the match has started.');
        return;
      }

      const current = [...this.currentRotation()];

      const oldPosition = current.findIndex(p => p?.number === player.number);
      if(oldPosition !== -1) current[oldPosition] = null;

      current[position] = player;
      this.updateRotation(current);
    }else if(this.started()){

      if(this.correctModeActive()){
        if(player.position == PlayerPosition.Libero && isFrontRow(position)) return;

        const current = [...this.currentRotation()];

        const containsLibero = current.find(p => p?.position == PlayerPosition.Libero);
        if(containsLibero) return;

        const oldPosition = current.findIndex(p => p?.number === player.number);
        if(oldPosition !== -1) current[oldPosition] = null;

        current[position] = player;
        this.updateRotation(current, true);
        return;
      }

      if(player.position == PlayerPosition.Libero) {
        if(isFrontRow(position)) return;

        const current = [...this.currentRotation()];

        const containsLibero = current.find(p => p?.position == PlayerPosition.Libero);
        if(containsLibero) return;

        const oldPlayer = current[position];
        if(oldPlayer) {
          if(oldPlayer.position == PlayerPosition.Libero) return;

          player.playerChangedFor = oldPlayer;

          current[position] = player;
          this.updateRotation(current);
        }
      }else {
        const current = [...this.currentRotation()];
        const oldPlayer = current[position];

        if(oldPlayer) {

          if(oldPlayer.playerChangedFor) {
            if(player.number !== oldPlayer.playerChangedFor.number) {
              alert("This position can only be changed back to the original player. Player " + oldPlayer.playerChangedFor.number);
            }else {
              current[position] = oldPlayer.playerChangedFor;
              oldPlayer.playerChangedFor = undefined;
              this.updateRotation(current);
            }
          } else {
            current[position] = player;
            player.playerChangedFor = oldPlayer;
            this.updateRotation(current);
          }
        }
      }
    }
  }


  private updateRotation(rotation: (Player | null)[], noHistory: boolean = false) {
    if(!noHistory) {
      this.setHistory.update(x => {
        return [...x, structuredClone(this.gameState())];
      });
    }

    this.gameState.update(x => {
      return {
        ...x,
        rotation: rotation
      };
    });

    console.log(this.gameState());
  }

  private rotate() {
    const state = this.gameState();
    if (!state.rotation || state.rotation.length === 0) return;

    let current = [...state.rotation];
    const first = current.shift()!;
    let newRotation = [...current, first];

    const liberoIndex = newRotation.findIndex(p => p?.position == PlayerPosition.Libero);
    if(liberoIndex !== -1) {
      const libero = newRotation[liberoIndex]!;
      if(libero.playerChangedFor) {
        if(isFrontRow(liberoIndex)) {
          newRotation[liberoIndex] = libero.playerChangedFor;
          libero.playerChangedFor = undefined;
          alert('Libero ' + libero.number + ' was exchanged for Player ' + newRotation[liberoIndex]?.number);
       }
      }
   }

    this.gameState.update(x => {
      return {
        ...x,
        rotation: newRotation
      }
    });
  }











  //Old Code
  constructor() {
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

    this.playerStats.update(x => {
      x.set(player.number, stats);
      return x;
    });

  }

  public formattedTime() {
    const t = this.matchTime();
    const minutes = Math.floor(t / 60).toString().padStart(2, '0');
    const seconds = (t % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

/*
  public exportPreviousSetsCsv() {
    const sets = this.previousSets();

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

 */
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

  public reset() {
    this.setHistory.set([]);
    this.gameState.set({
      homeScore: 0,
      awayScore: 0,
      currentServer: 'home',
      currentSet: 1,
      homeSetsWon: 0,
      awaySetsWon: 0,
      rotation: Array(6).fill(null)
    });

    this.matchStatus.set('notStarted');
    this.playerStats.set(new Map());
    this.previousSets.set([]);
    this.matchTime.set(0);
    if (this.timerInterval) clearInterval(this.timerInterval);
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
