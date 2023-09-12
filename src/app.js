'use strict'

const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
const debug = require("debug")("circle-manager-api:app")
const {fetch2, FetchResponseError} = require("./util/fetch");

const app = express();

app.use(bodyParser.json());
app.use(cors())
app.set('view engine', 'jade');

app.post("/", async (req, res) => {
    const body = await req.body
    const user_data = {}

    try{
        const token_fetch_option = {
            method: 'POST',
            body: new URLSearchParams({
                    'client_id': process.env.CLIENT_ID,
                    'client_secret': process.env.CLIENT_SECRET,
                    'grant_type': 'authorization_code',
                    'code': body.code,
                    'redirect_uri': process.env.REDIRECT_URL
                }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        const token_res = await (await fetch2("https://discord.com/api/oauth2/token", token_fetch_option)).json();

        const token = token_res["access_token"];

        const fetch_option = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',

            },
        };

        user_data["identity"] =  await (await fetch2("https://discord.com/api/users/@me", fetch_option)).json();
        user_data["guilds"] =  await (await fetch2("https://discord.com/api/users/@me/guilds", fetch_option)).json();

    }catch (e){
        if(e instanceof SyntaxError){
            debug(`Syntax Error`)
            debug(e)
            res.status(400).json({error: "bad body format"});
            return;
        }
        if(e instanceof FetchResponseError){
            if(e.status>=500){
                debug(`Discord API server Error`)
                debug(e)
                debug(await e.response.json())
                return res.status(502).json({error: "bad gatway()"});
            }
            if(e.location==="https://discord.com/api/oauth2/token" && e.status===400){
                debug(`cannot get access token`)
                debug(e)
                debug(await e.response.json())
                return res.status(400).json({error: "bad code or request"})
            }
        }
        console.log(e)
        console.log(e.location==="https://discord.com/api/oauth2/token", e.status)
        return res.status(402).json({error:e.message})

    }
    if(JSON.stringify(user_data)==="{}") return res.status(400).json({"error":"body is empty"})

    debug(user_data)
    const joinedAzisabaDiscord = !!(user_data.guilds.filter(v => {
        return v.id === process.env.AZISABA_DISCORD_GUILDID
    })).length;

    const res_body = {
        id: user_data.identity.id,
        username: user_data.identity.username,
        joinedDiscord: joinedAzisabaDiscord
    }
    res.status(200).json(res_body)

});

module.exports = app;