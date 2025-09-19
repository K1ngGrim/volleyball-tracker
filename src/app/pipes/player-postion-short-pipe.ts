import { Pipe, PipeTransform } from '@angular/core';
import {Player} from '../models/player';

@Pipe({
  name: 'playerPostionShort'
})
export class PlayerPostionShortPipe implements PipeTransform {

  transform(player: Player): string {
    switch (player.position) {
      case 'Outside Hitter':
        return 'OH';
      case 'Opposite Hitter':
        return 'OPP';
      case 'Middle Blocker':
        return 'MB';
      case 'Setter':
        return 'S';
      case 'Libero':
        return 'L';
      default:
        return '';
    }
  }

}
