export const AVAILABLE_CHARACTERS = [
    { id: 'mario', name: 'Mario', color: '#ef4444', frame: 0 },
    { id: 'luigi', name: 'Luigi', color: '#22c55e', frame: 1 },
    { id: 'peach', name: 'Peach', color: '#f472b6', frame: 2 },
    { id: 'yoshi', name: 'Yoshi', color: '#10b981', frame: 3 }
];

export const PlayerConfig = {
    selectedPlayers: [], // will hold character ids
    
    setPlayers(selections) {
        this.selectedPlayers = selections;
    },
    
    getPlayers() {
        return this.selectedPlayers;
    }
};
