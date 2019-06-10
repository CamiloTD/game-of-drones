import { PersistentStorage, GameStorage, VolatileStorage } from '../src/storage';
import { Component } from 'react';
import { PLAYER_1, PLAYER_2 } from '../src/constants';
import Layout from '../src/components/layout/layout';
import '../src/components/settings/settings.styl';
import '../src/components/endscreen/endscreen.styl';
import Icon from '../src/components/icon';
const HEADER_ICON_SIZE = 32;

export default class extends Component {

    constructor (...args) {
        super(...args);

        this.state = { moves: [] }
    }

    componentDidMount () {
        /* Sync the component state with PersistentStorage */

        this.setState(PersistentStorage(this, {
            player_1: 'player_1',
            player_2: 'player_2',
            p1_color: 'p1_color',
            p2_color: 'p2_color',
            moves: 'moves',
            rules: 'rules',
            playing: 'playing'
        }));

        this.setState(GameStorage(this, {
            turn: 'turn',
            wins: 'wins',
            loses: 'loses',
            ties: 'ties',
            winner: 'winner'
        }));
    }

    render () {
        const { p1_color, player_1, player_2, p2_color, moves = [], turn, wins, loses, ties, playing, winner } = this.state;
        const winner_name = winner === PLAYER_1? player_1: player_2;
        const winner_color = winner === PLAYER_1? p1_color: p2_color;
        // const loser_name  = winner === PLAYER_1? player_2: player_1;

        const playAgain = () => {
            GameStorage.turn = 0;
            GameStorage.wins = 0;
            GameStorage.loses = 0;
            GameStorage.ties = 0;
            
            window.location.href = "/play";
        };

        return <Layout>
            <div className="endscreen-main" style={{ background: winner_color }}>
                <div className="title">
                    <Icon name="trophy" size={HEADER_ICON_SIZE}/>Congratulations {winner_name}!<Icon name="trophy" size={HEADER_ICON_SIZE}/>
                </div>
                <div className="marker">
                    <span className="player">{player_1}</span>
                    <span className="separator">vs</span>
                    <span className="player">{player_2}</span>
                    <span className="score">{wins}</span>
                    <span className="separator">-</span>
                    <span className="score">{loses}</span>
                </div>
                <div className="footer">
                    <div className="buttons">
                        <button onClick={playAgain}>Play Again</button>
                        <button onClick={() => window.location.href = "/leaderboards"}>Stats</button>
                        <button onClick={() => window.location.href = "/"}>Main Menu</button>
                    </div>
                </div>
            </div>
        </Layout>;
    }

}