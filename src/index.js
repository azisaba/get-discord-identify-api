'use strict'

require("dotenv-safe").config();
if (!process.env.DEBUG) {
    process.env.DEBUG = 'spicyazisaban:*'
}

const debug = require("debug")("circle-manager-api:server")
const http = require("http");

/**
 * @type {*|Express|{}}
 */
const app = require("./app");

const port = parseInt(process.env.PORT || "3000", 10);
app.set("port", port)
const server = http.createServer(app)


server.on("error", (error)=>{
    throw error;
})

server.on('listening', ()=>{
    const address = server.address()
    const bind = typeof address === 'string'
        ? 'pipe ' + address
        : 'port ' + address?.port
    debug('Listening on ' + bind)
})

server.listen(port);
