import { Component } from 'react';
import Navbar from '../navbar/navbar';

import './layout.styl';

export default ({ children, title, goback = "/" }) => (
    <div className="layout-main">
        { title && <Navbar title={title} goback={goback}/> }

        {children}
        <div className="layout-background"></div>

        <style jsx global>{`
            body {
                margin: 0;
                padding: 0;
            }
        `}</style>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet"></link>
    </div>
);