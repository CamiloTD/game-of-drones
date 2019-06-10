import React from 'react';

export default (({ value }) => (
    <div className="avatar-main">
        <img src={"/static/avatars/" + value + ".png"}/>
    </div>
));