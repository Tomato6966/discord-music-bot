//Modules
const { Client, Collection } = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const discord = require("discord.js");
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();
client.aliases = new Collection();

client.applies = require("quick.db");

client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("messageReactionAdd", async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch()
    if(user.bot) return;
    if(!reaction.message.guild ) return;
 
    
    if(reaction.message.id === "803715067928510465"){
        if(client.applies.get(user.id))
        {
            return user.send("DU HAST DICH BEI UNS SCHON BEWORBEN!")
        }
        else{
            client.applies.set(user.id, true);
        }
        apply(reaction, user);
    }
    if(reaction.message.channel.parent && reaction.message.channel.parent.id === "803719111992541224"){
        if(reaction.emoji.name === "✅"){
            let userid = client.applies.get(reaction.message.id);
            let theuser = reaction.message.guild.members.cache.get(userid)
            theuser.send("DU WURDEST ANGENOMMEN")
        }
        if(reaction.emoji.name === "❌"){
            let userid = client.applies.get(reaction.message.id);
            let theuser = reaction.message.guild.members.cache.get(userid)
            theuser.send("DU WURDEST ABGELEHNT")
        }
    }

    

})

var antworten = [];
        var fragen = [
            "Wie heißt du?",
            "Wie alt bist du?",
            "Was ist das Beste Hosting Unternehmen?",
            "Was ist der Beste Music Bot?",
        ]
        const embed = new discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle("A NEW QUESTION")
    function apply(reaction, user){
     var counter = 0;
     user.send(embed.setDescription(fragen[counter])).then(msg => {
        msg.channel.awaitMessages(m => m.author.id === user.id, { max: 1, time: 120*1000, errors: ['time'] })
		.then(collected => {
            antworten.push(collected.first().content);
            counter++;
            user.send(embed.setDescription(fragen[counter])).then(msg => {
                msg.channel.awaitMessages(m => m.author.id === user.id, { max: 1, time: 120*1000, errors: ['time'] })
                .then(collected => {
                    antworten.push(collected.first().content);
                    counter++;
                    user.send(embed.setDescription(fragen[counter])).then(msg => {
                        msg.channel.awaitMessages(m => m.author.id === user.id, { max: 1, time: 120*1000, errors: ['time'] })
                        .then(collected => {
                            antworten.push(collected.first().content);
                            counter++;
                            user.send(embed.setDescription(fragen[counter])).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === user.id, { max: 1, time: 120*1000, errors: ['time'] })
                                .then(collected => {
                                    antworten.push(collected.first().content);
                                    counter++;
                                    ende_apply(reaction,user);
                                    user.send(new discord.MessageEmbed()
                                    .setColor("GREEN")
                                    .setTitle(`Vielen Dank für deine Bewerbung!`)
                                    .setDescription(`<#${reaction.message.channel.id}>`))
                                })
                                .catch(error => {
                                    console.log(error)
                                    msg.channel.send('Looks like nobody got the answer this time.');
                                });
                             })
                        })
                        .catch(error => {
                            console.log(error)
                            msg.channel.send('Looks like nobody got the answer this time.');
                        });
                     })
                })
                .catch(error => {
                    console.log(error)
                    msg.channel.send('Looks like nobody got the answer this time.');
                });
             })
		})
		.catch(error => {
            console.log(error)
			msg.channel.send('Looks like nobody got the answer this time.');
		});
     })
    }
     function ende_apply(reaction,user){
        client.applies.set(user.id, true);
        
        const embed = new discord.MessageEmbed()
        .setColor("RED")
        .setTitle(`${user.tag} hat sich beworben!`)
        .setTimestamp()
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setDescription(`${user}`)
        for(let i = 0; i < antworten.length; i++){
        embed.addField(fragen[i], "> " + antworten[i]);
        }
        reaction.message.guild.channels.cache.get("797043865567625308").send(embed).then(msg => {
            msg.react("✅");
            msg.react("❌");
            client.applies.set(msg.id, user.id)})
     }

let i = 0;
var STATUSTEXT = [
    "1",  //index == 0
    "2",  //index == 1
    "3",  //index == 2
    "4"   //index == 3
];
client.on("ready", () => {

   /** client.guilds.cache.get("748088208427974676")
    .channels.cache.get("803708066658910259")
    .messages.fetch("803715067928510465").then(msg => msg.react("🎟️"));
    */

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
    
    if(cmd === "delete"){
        if(!message.mentions.users.first()) return message.reply("PLEASE PING A USER")
        message.reply("SUCCESS!")
        client.applies.set(message.mentions.users.first().id, false);
    }

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

   
    if (command) 
        command.run(client, message, args);
    
});

client.login(config.token);