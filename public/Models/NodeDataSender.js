class NodeDataSender {
    /**
     * Send data to the node server.
     * @param {Object} data - The data to send.
     */
    static sendData(data) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/api/scoreboard', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("username=" + data.username + "&points=" + data.points + "&mode=" + data.mode);
    }
    /**
     * Asks to the server the scoreboard data and returns it.
     * @param {String} mode - Gamemode
     * @returns {Promise} - The data requested.
     */
    static loadData(mode) {
        return new Promise(function (resolve, reject) {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = () => {
                resolve(JSON.parse(xhttp.responseText));
            }
            xhttp.open("GET", `/api/scoreboard/${mode}`, true);
            xhttp.send();
        });
    }
}
