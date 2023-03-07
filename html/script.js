function getPlayerInfo(id){
    return fetch("https://api.battlemetrics.com/players/"+id+"?include=server")
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

function getPlayerIdsFromStorage(){
    if (window.localStorage) {
        let data = localStorage.getItem("playerIds")
        if(data == null) { return [] }
        let json = JSON.parse(data)
        let playerIds = json.playerIds
        if(playerIds == null) { return [] }
        return playerIds
    } else {
        return []
    }
}

async function updatePlayerList(){
    for (let playerId of getPlayerIdsFromStorage()){
        let data = await getPlayerInfo(playerId)
        let onlineServers = data.included.filter(item => item.meta.online == true && item.relationships.game.data.id == "rust")
        console.log(onlineServers)
    }
}

window.onload = function(){
    updatePlayerList()
}