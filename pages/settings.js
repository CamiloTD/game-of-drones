import { PersistentStorage } from '../src/storage';
import { Component } from 'react';
import { NewColor } from '../src/constants';
import Layout from '../src/components/layout/layout';
import '../src/components/settings/settings.styl';
import Icon from '../src/components/icon';
import rules from '../src/rules';

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
            p1_color: 'p1_color',
            p2_color: 'p2_color',
            moves: 'moves',
            rules: 'rules'
        }));
    }

    render () {
        const { p1_color, p2_color, moves = [] } = this.state;
        
        const setupP1NewColor = () => PersistentStorage.p1_color = NewColor(PersistentStorage.p1_color);
        const setupP2NewColor = () => PersistentStorage.p2_color = NewColor(PersistentStorage.p2_color);
        const changeMove = (i, move) => {
            if(!move || !move.trim()) return;

            move = move[0].toUpperCase() + move.substring(1).toLowerCase()
            PersistentStorage.moves = [...moves.slice(0, i), move, ...moves.slice(i + 1)];
        }

        const Moves = moves.map((move, i) => (
            <div className="move" key={i} onClick={() => changeMove(i, prompt("Enter your move name"))}><Icon name={move} size={32}/></div>
        ));

        const Rules = rules.map(([ lose, win ], i) => {
            return <div className="rule" key={i}>
                <div className="lose">
                    <Icon name={moves[lose]} size={24}/>
                </div>
                loses against
                <div className="win">
                    <Icon name={moves[win]} size={24}/>
                </div>
            </div>;
        })

        return <Layout title="Leaderboards" goback="/">
            <div className="settings-main">
                <Header title="Colors" subtitle="Click the colors and choose your favorites"/>
                <div className="colors">
                    <div className="color" style={{ background: p1_color }} onClick={setupP1NewColor}></div>
                    <span style={{ color: p1_color }} onClick={setupP1NewColor}>Color 1: {p1_color}</span>
                    
                    <div className="color" style={{ background: p2_color }} onClick={setupP2NewColor}></div>
                    <span style={{ color: p2_color }} onClick={setupP1NewColor}>Color 2: {p2_color}</span>
                </div>

                <Header title="Moves" subtitle="Customize your moves! We give you the icon ;)"/>
                <div className="moves">
                    {Moves}
                    {moves.map((move, i) => <span className="name" key={i}>{move}</span>)}
                </div>
                <Header title="Rules" subtitle="The following rules will apply"/>
                <div className="rules">
                    {Rules}
                </div>
            </div>
        </Layout>;
    }

}

const Header = ({ title, subtitle }) => (
    <div className="header">
        <div className="main">
            <div className="separator"/>
            <span className="title">{ title }</span>
            <div className="separator"/>
        </div>
        <span className="subtitle">{ subtitle }</span>
    </div>
);