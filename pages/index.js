import { PersistentStorage } from '../src/storage';
import { Component } from 'react';

import Avatar from '../src/components/index/avatar';
import Layout from '../src/components/layout/layout';
import '../src/components/index/index.styl';
import { NewColor } from '../src/constants';

export default class extends Component {

    constructor (...args) {
        super(...args);

        /* Sync the component state with PersistentStorage */
        this.state = {}
    }

    componentDidMount () {
        this.setState(PersistentStorage(this, {
            player_1: 'player_1',
            player_2: 'player_2',
            p1_color: 'p1_color',
            p2_color: 'p2_color',
            playing: 'playing'
        }));
    }

    render () {
        const { player_1, player_2, p1_color, p2_color, playing } = this.state;
        
        if(process.browser && playing) window.location.href = "/play";
        
        const onPJ1Rename = (e) => PersistentStorage.player_1 = e.target.value;
        const onPJ2Rename = (e) => PersistentStorage.player_2 = e.target.value;
        const setupP1NewColor = () => PersistentStorage.p1_color = NewColor(PersistentStorage.p1_color);
        const setupP2NewColor = () => PersistentStorage.p2_color = NewColor(PersistentStorage.p2_color);

        const onStartClick = () => {
            if(!player_1 || !player_2) return alert("Please enter a name for both players.");
            PersistentStorage.playing = true;
        }
        const onSettingsClick = () => window.location.href = "/settings";
        const onLeaderboardsClick = () => window.location.href = "/leaderboards";
        
        return <Layout>
            <div className="index-main">
                <div className="header">
                    <Avatar value="uruit"/>
                </div>
                <div className="body">
                    <div className="title">Game Of Drones</div>
                    <div className="inputs">
                        <span style={{ background: p1_color }} onClick={setupP1NewColor}>Player 1</span>
                        <input type="text" value={player_1} onChange={onPJ1Rename} placeholder="Player 1"/>
                    </div>
                    <div className="inputs">
                        <span style={{ background: p2_color }} onClick={setupP2NewColor}>Player 2</span>
                        <input type="text" value={player_2} onChange={onPJ2Rename} placeholder="Player 2"/>
                    </div>
                </div>
                <div className="footer">
                    <button className="leaderboards" onClick={onLeaderboardsClick}>Stats</button>
                    <button className="settings" onClick={onSettingsClick}>Customize</button>
                </div>
                <div className="sub-footer">
                    <button className="start" onClick={onStartClick}>
                        Play Now!
                    </button>
                </div>
            </div>
        </Layout>;
    }

}