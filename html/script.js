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
        let playerIds = JSON.parse(data)
        if(playerIds == null) { return [] }
        return playerIds
    } else {
        return []
    }
}

function addPlayerIdToStorage(id){
    if (window.localStorage) {
        let oldIds = getPlayerIdsFromStorage()
        oldIds.push(id)
        localStorage.setItem("playerIds", JSON.stringify(oldIds))
    }
}

async function updatePlayerList(){
    for (let playerId of getPlayerIdsFromStorage()){
        let data = await getPlayerInfo(playerId)
        let playerName = data.data.attributes.name
        let onlineServer = data.included.filter(item => item.meta.online == true && item.relationships.game.data.id == "rust")[0]
        var serverName = "offline"
        if(onlineServer != null){
            serverName = onlineServer.attributes.name
        }
        console.log(playerName+": "+serverName)
    }
}

window.onload = function(){
    updatePlayerList()
    let playerId = document.getElementById("playerId")
    document.getElementById("addPlayerId").onclick = function(){
        addPlayerIdToStorage(playerId.value)
        updatePlayerList()
    }
}