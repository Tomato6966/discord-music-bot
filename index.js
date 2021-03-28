//Modules
const { Client, Collection } = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const discord = require("discord.js");
const client = new Client({
disableEveryone: true
, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


let i = 0;
var STATUSTEXT = [
    "1",  //index == 0
    "2",  //index == 1
    "3",  //index == 2
    "4"   //index == 3
];
client.on("ready", () => {
    console.log("Bot is ready");
        //INIT
        client.user.setActivity("STATUSTEXT", { type: "STREAMING", url: "https://twitch.tv/#" })
    //LOOP
    setInterval(()=>{
        const index = Math.floor(i);
        if(index == 0 )client.user.setActivity(STATUSTEXT[index], { type: "STREAMING", url: "https://twitch.tv/#" }) 
        else if(index == 1 )client.user.setActivity(STATUSTEXT[index], { type: "PLAYING"}) 
        else if(index == 2 )client.user.setActivity(STATUSTEXT[index], { type: "WATCHING"}) 
        else if(index == 3 )client.user.setActivity(STATUSTEXT[index], { type: "LISTENING"}) 
        else client.user.setActivity(STATUSTEXT[index], { type: "PLAYING"}) 
        i++;
        if(i===STATUSTEXT.length) i -= STATUSTEXT.length;
    }, 5*1000)

})





client.on("message", async message => {
    const prefix = (config.prefix);
    if (message.author.bot) return;
    if (!message.guild) return;

    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

   
    if (command) 
        command.run(client, message, args);
    
});

client.login(config.token);