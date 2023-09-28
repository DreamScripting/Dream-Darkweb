module.exports = {
  "statusType": "LISTENING", // WATCHING, PLAYING, LISTENING, STREAMING
  "bowner": ["672027578181353473"], // bot owner id here
  "logChannel": "", // for logs
  "darkwebChannel": "",  //  for the main channel where the main posts will be sent
  "darkwebRole": "",  //  role id which will give the users access to use the dark web bot
  "serverid": "",  // discord server id
  "embedColour": "#000001", // embed line colour
  "TOKEN": "" || process.env.TOKEN,// here goes the bot token which we can find in the discord dev portal.
  "prefix": "x", // perfix for the bot here to run all the commands
  "syndicate": "", // role id for creed posts
  "racers": "", // role id for racing posts
  "webid": "" || process.env.webid, //  these are the wobhooks syndicate messages
  "webtoken": "" || process.env.webtoken, //  these are the wobhooks syndicate messages
  "errid": "" || process.env.errid, // webhook id for errors
  "errtoken": "" || process.env.errtoken, // webhook token for errors
  "accountlog": "", // for account creation logs
  "adminrole": "", // for commands that are used by admins only
  "wdlog": "", // for warn and delete logs of messages
  "dwpic": "https://cdn.discordapp.com/avatars/1022239365201657926/dc02f86914bdf7cbfae5765de93a51bf.webp?size=2048", // dark web icon
  "mid": { // for racing dark web 
    "id": "", // webhook id
    "token": "" // webhook token
  },
  'cooldown': 60000 // set to 100 if you dont want users to get a cooldown
};