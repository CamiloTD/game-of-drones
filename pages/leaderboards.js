import { PersistentStorage } from '../src/storage';
import { Component } from 'react';
import Layout from '../src/components/layout/layout';
import '../src/components/leaderboards/leaderboards.styl';
import Store from 'booga';
import { GameAPI } from '../src/microservices';
import Icon from '../src/components/icon';

const state = Store({
    name: "leaderboard-state"
})
export default class extends Component {

    constructor (...args) {
        super(...args);

        /* Sync the component state with PersistentStorage */
        this.state = {
            moves: []
        }
    }

    componentDidMount () {
        this.setState(PersistentStorage(this, {
            player_1: 'player_1',
            player_2: 'player_2',
            p1_color: 'p1_color',
            p2_color: 'p2_color',
            moves: 'moves',
            rules: 'rules'
        }));

        this.setState(state(this, {
            search: 'search',
            wins: 'wins',
            loses: 'loses',
            ties: 'ties',
            srch: 'srch',
            victories: 'victories'
        }))
        
        this.search(PersistentStorage.player_1)
    }

    async search (name) {
        const stats = await GameAPI.stats(name);

        state.search = name; 
        state.srch = name; 
        state.wins = stats.wins;
        state.loses = stats.loses;
        state.ties = stats.ties;
        state.victories = stats.victories;

        return stats;
    }

    render () {
        const { p1_color, p2_color, moves = [], player_1, player_2, wins, loses, ties, victories, srch } = this.state;
        const go = () => this.search(state.srch);
        const on_search_change = (e) => state.srch = e.target.value;
        return <Layout title="Stats" goback="/">
            <div className="leaderboards-main">
                <div className="search">
                    <input type="text" value={srch} onChange={on_search_change}/>
                    <button onClick={go}>Go</button>
                </div>
                <div className="details">
                    <div className="row">
                        <Icon name="trophy" size={16}/> Wins: <span className="value">{wins}</span>
                    </div>
                    <div className="row">
                    <Icon name="fire" size={16}/> Loses: <span className="value">{loses}</span>
                    </div>
                    <div className="row">
                        <Icon name="fight" size={16}/> Ties: <span className="value">{ties}</span>
                    </div>
                    <div className="row">
                        <Icon name="crown" size={16}/> Victories: <span className="value">{victories}</span>
                    </div>
                </div>
            </div>
        </Layout>;
    }

}