import { PersistentStorage, GameStorage, VolatileStorage } from '../src/storage';
import { MoveKeys, P1_WINS, P2_WINS, TIE, PLAYER_1, PLAYER_2 } from '../src/constants';
import { Component } from 'react';
import Layout from '../src/components/layout/layout';
import '../src/components/settings/settings.styl';
import Icon from '../src/components/icon';
import '../src/components/play/play.styl';
import rules from '../src/rules';
import { GameAPI } from '../src/microservices';

const HEADER_ICON_SIZE = 18;

export default class extends Component {

    constructor (...args) {
        super(...args);

        this.state = {
            moves: []
        }
    }

    componentDidMount () {
        /* Sync the component state with PersistentStorage */

        this.setState(PersistentStorage(this, {
            player_1: 'player_1',
            player_2: 'player_2',
            p1_color: 'p1_color',
            p2_color: 'p2_color',
            moves: 'moves',
            playing: 'playing'
        }));

        this.setState(GameStorage(this, {
            turn: 'turn',
            wins: 'wins',
            loses: 'loses',
            ties: 'ties',
            p1_move: 'p1_move',
            p2_move: 'p2_move',
        }));

        this.setState(VolatileStorage(this, {
            end_turn_screen: 'end_turn_screen',
            timeout: 'timeout',
            round_winner: 'round_winner'
        }));

        setupEvents();
        checkGameState();
    }

    render () {
        const { p1_move, p2_move, 
                p1_color, p2_color,
                player_1, player_2,
                moves = [], turn, 
                wins, loses, ties, 
                timeout, round_winner,
                end_turn_screen
            } = this.state;

        const [ color, name, my_wins, my_loses ] = turn % 2 == 0? 
                [ p1_color, player_1, wins, loses ] : 
                [ p2_color, player_2, loses, wins ];
        
        const Moves = moves.map((move, i) => (
            <div className="move" key={i} onClick={() => chooseMove(i)}>
                <Icon name={move}/>
            </div>
        ));
        
        const Keys = MoveKeys.map((key, i) => (
            <div className="key" key={i} onClick={() => chooseMove(i)}>
                {key}
            </div>
        ));

        const TitleDiv = () => (
            <div className="player_name">
                {name}'s Turn
                <div className="description">Select a move!</div>
                <div className="sub-description">Press a key...</div>
            </div>
        );

        const MovesDiv = () => (
            <div className="moves">
                {Moves}
                {Keys}
            </div>
        )

        return <Layout>
            <div className="play-main">
                <div className="background" style={{ background: end_turn_screen? "transparent" : color }}></div>
                <div className="header">
                    <Item icon="clock"  name="Turn"  value={turn || my_wins + my_loses + ties}/>
                    <Item icon="trophy" name={player_1}  value={wins}/>
                    <Item icon="fire"   name={player_2}  value={loses}/>
                    <Item icon="fight"  name="Ties"  value={ties}/>
                </div>
                {!end_turn_screen && <TitleDiv /> }
                {!end_turn_screen && <MovesDiv /> }
                { end_turn_screen && 
                    <EndTurn {...{ timeout, round_winner, p1_move, p2_move, player_1, player_2, moves }} />
                }
            </div>
        </Layout>;
    }

}

const Item = ({ name, value, icon }) => (
    <div className="item">
        <Icon name={icon} size={HEADER_ICON_SIZE}/>
        <span><b>{name}:</b> {value}</span>
    </div>
);
const EndTurn = ({ timeout, round_winner, p1_move, p2_move, player_1, moves }) => (
    <div className="end-turn">
        { round_winner? <span>{round_winner} wins...</span> : <span>Tie</span>}
        <br/>
        { round_winner && 
            <div className="defeats">
                <Icon name={ round_winner === player_1? moves[p1_move] : moves[p2_move] } size={24}/>
                defeats 
                <Icon name={ round_winner === player_1? moves[p2_move] : moves[p1_move] } size={24} />
            </div>
        }
        <br/>
        Next turn in: { timeout }
    </div>
);

function chooseMove (move) {
    const { turn } = GameStorage;

    GameStorage[turn & 1? "p2_move" : "p1_move"] = move;

    /* If was 2nd player's turn */
    if(turn & 1) {
        const result = evaluateRound();

        switch(result) {
            case P1_WINS:
                nextRound({ winner: PLAYER_1 });
                break;
            case P2_WINS:
                nextRound({ winner: PLAYER_2 });
                break;
            default:
                nextRound({});
        }
    }
    GameStorage.turn++;
}

function nextRound ({ winner }) {
    VolatileStorage.end_turn_screen = true;
    VolatileStorage.timeout = 5;
    VolatileStorage.round_winner = winner === PLAYER_1? PersistentStorage.player_1 : winner === PLAYER_2? PersistentStorage.player_2 : "";

    (async () => {
        while(VolatileStorage.timeout > 0) {
            VolatileStorage.timeout--;
            await new Promise((done, err) => setTimeout(done, 1000));
        }

        VolatileStorage.end_turn_screen = false;
    })();

    switch(winner) {
        case PLAYER_1: GameStorage.wins++; break;
        case PLAYER_2: GameStorage.loses++; break;
        default: GameStorage.ties++; break;
    }

    if(GameStorage.wins >= 3) endGame({ winner: PersistentStorage.player_1 });
    else if(GameStorage.loses >= 3) endGame({ winner: PersistentStorage.player_2 });
}

async function endGame ({ winner }) {
    PersistentStorage.playing = false;
    GameStorage.winner = winner;

    if(GameStorage.online) {
        
    } else {
        PersistentStorage.playing = false;
        GameStorage[winner] = (GameStorage[winner] || 0) + 1;

        try {
            await GameAPI.reportGame({
                player_1: PersistentStorage.player_1,
                player_2: PersistentStorage.player_2,
                wins: GameStorage.wins,
                loses: GameStorage.loses,
                ties: GameStorage.ties,
                winner: winner
            });
        } catch (exc) {
            alert("Error: " + exc.message);
            return;
        }
    }

    window.location.href = "/endscreen";
}

function checkGameState () {
    if(GameStorage.wins >= 3 || GameStorage.loses >= 3) resetGameState();
}

function resetGameState () {
    GameStorage.turn = 0;
    GameStorage.wins = 0;
    GameStorage.loses = 0;
    GameStorage.ties = 0;
}

function evaluateRound () {
    const { p1_move, p2_move } = GameStorage;
    const wins = [ p2_move, p1_move ].toString();
    const loses = [ p1_move, p2_move ].toString();

    for(const rule of rules){
        if(rule.toString() === wins)
            return P1_WINS;
        
        if(rule.toString() === loses)
            return P2_WINS;
    }

    return TIE;
}

function setupEvents () {
    const Pressed = {};

    document.body.addEventListener('keydown', (e) => {
        /* Evades multiple execution */
        if(Pressed[e.key] || VolatileStorage.end_turn_screen) return;
        Pressed[e.key] = true;
        
        const key = e.key.toUpperCase();
        const index = MoveKeys.indexOf(key);

        if(index === -1)
            return;
        
        chooseMove(index);
    });

    document.body.addEventListener('keyup', (e) => {
        delete Pressed[e.key];
    });
}