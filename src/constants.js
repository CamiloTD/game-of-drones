import { PersistentStorage } from '../src/storage';

const colors = ["#1daed7", "#d71d67", "#1ed760", "#cdd71d", "#d71d57", "#921dd7", "#1dd7cd"];

function newColor (actual) {
    var { p1_color, p2_color } = PersistentStorage;
    var new_color = "";
    var index = colors.indexOf(actual);

    do {
        new_color = colors[index++ % colors.length];
    } while(new_color == p1_color || new_color == p2_color);
    
    return new_color;
}

export const NewColor = newColor;
export const MoveKeys = ["J", "K", "L"];

export const P1_WINS = 0;
export const P2_WINS = 1;
export const TIE = 2;

export const PLAYER_1 = 1;
export const PLAYER_2 = 2;
export const WEBAPP_HOST = "http://localhost:3000";