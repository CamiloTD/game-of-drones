require('colors');
const YAML = require('yamljs');
const { Game } = require('./db-models');
const Exceptions = YAML.load(__dirname + '/docs/exceptions.yml');

/* 
    This Backend is written using unete.io
    An alpha library that uses JS Proxies for creating reflective APIs

    This was created by me (CamiloTD), so it doesn't break the "You can not use tools that don’t allow us to evaluate your skills in the
    evaluation criteria" rule, you can look at the code at: https://github.com/SuperCamiloTD/unete-io

    Documentation: https://supercamilotd.gitbook.io/unete-io
*/

module.exports = {

    /* Report a game */
    async reportGame (stats) {
        if(!stats || typeof stats !== "object")
            throw "INVALID_STATS";

        const { player_1, player_2, wins, loses, ties, winner } = stats;

        if(!winner || (winner !== player_1 && winner !== player_2)) throw "INVALID_WINNER";

        return await Game.create({ player_1, player_2, wins, loses, ties, winner });
    },

    async stats (player) {
        let [ wdata ] = await Game.collection.aggregate([
            { $match: { player_1: player  }},
            {
                $group: { 
                    _id: null,
                    wins : { $sum: "$wins" },
                    loses: { $sum: "$loses" },
                    ties : { $sum: "$ties" }
                }
            }
        ]).toArray();

        let [ ldata ] = await Game.collection.aggregate([
            { $match: { player_2: player }},
            {
                $group: { 
                    _id: null,
                    wins : { $sum: "$loses" },
                    loses: { $sum: "$wins" },
                    ties : { $sum: "$ties" }
                }
            }
        ]).toArray();

        if(!wdata) wdata = { wins: 0, loses: 0, ties: 0 };
        if(!ldata) ldata = { wins: 0, loses: 0, ties: 0 };
        
        return {
            wins: wdata.wins + ldata.wins,
            loses: wdata.loses + ldata.loses,
            ties: wdata.ties + ldata.ties,
            victories: await Game.count({ winner: player })
        };
    },

    $error: (err) => typeof err === "string" ? ({ code: err, message: Exceptions[err] || err }) : err
}