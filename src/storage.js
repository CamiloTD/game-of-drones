import Store from 'booga';

/* Temporal Global State */
export const VolatileStorage = Store({
    name: "MemorySpace",
    initial: {
        end_turn_screen: false,
        timeout: 5
    }
});

/* Global State that syncs with localStorage  */
export const PersistentStorage = Store({
    name: "LocalStorage",
    storage: Store.localStorage("GameOfDrones"),
    initial: {
        player_1: "",
        player_2: "",
        p1_color: "#1daed7",
        p2_color: "#d71d67",
        moves: ["Rock", "Paper", "Scissors"],
        playing: false
    }
});

/* Game Storage */
export const GameStorage = Store({
    name: "InGame",
    storage: Store.localStorage("InGame"),
    initial: {
        turn: 0,
        wins: 0,
        loses: 0,
        ties: 0,
        online: false
    }
});

/* Leaderboards */
export const LocalLeaderboards = Store({
    name: "Leaderboards",
    storage: Store.localStorage("Leaderboards")
})