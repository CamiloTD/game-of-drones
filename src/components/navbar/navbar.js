import './navbar.styl';
import Icon from '../icon';

export default (({ title, goback }) => (
    <div className="navbar-main">
        <div className="goback" onClick={() => window.location.href = goback}>
            <Icon name="back" size={24}/>
        </div>
        <div className="title">{ title }</div>
    </div>
))