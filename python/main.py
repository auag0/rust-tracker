from flask import Flask, render_template, request
import json
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", testMsg=fetchPlayersInfo(getPlayerIdsFromCookie()))


"""{
	"trackingIds": [
		"1087868393",
		"970123124",
		"991773861"
	]
}"""
def getPlayerIdsFromCookie():
    tracking_ids = request.cookies.get("player_tracking_ids")
    if(tracking_ids == None):
        return []
    try:
        tracking_ids_json = json.loads(tracking_ids)
    except json.JSONDecodeError:
        return []
    if("trackingIds" not in tracking_ids_json):
        return []
    trackingIds = tracking_ids_json["trackingIds"]
    return trackingIds

class PlayerInfo():
    def __init__(self, id, name, joinedServerName) -> None:
        self.id = id
        self.name = name
        self.joinedServerName = joinedServerName
    id = None
    name = None
    joinedServerName = None

def parsePlayerInfo(jsonData):
    attributes = jsonData.get("attributes")
    included = jsonData.get("included")
    playerId = attributes["id"]
    name = attributes["name"]
    onlineServer = [item for item in included if item["meta"]["online"] == True and item["relationships"]["game"]["data"]["id"] == "rust"]
    return PlayerInfo(playerId, name, onlineServer)

def fetchPlayersInfo(ids):
    playersInfo = []
    for id in ids:
        response = requests.get(f"https://api.battlemetrics.com/players/{id}?include=server,identifier")
        if(response.status_code == 200):
            playersInfo.append(parsePlayerInfo(response.json()))

app.run(port=8000, debug=True)