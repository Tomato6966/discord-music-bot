const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
module.exports = {
    name: "apply",
    aliases: [""],
    category: "info",
    description: "Apply for this TEAM",
    usage: "[command], [aliases], [command <cmd>]",
    run: async (client,message,args) => {
        var antworten = [];
        var fragen = [
            "Wie heißt du?",
            "Wie alt bist du?",
            "Was ist das Beste Hosting Unternehmen?",
            "Was ist der Beste Music Bot?",
        ]
        /**
         * [] === ["asdasd","213124","purple"] //array[0] --> asdasd  | array[1] --> 213124  | array[2] --> purple
         */
     var counter = 0;
     message.author.send(fragen[counter]).then(msg => {
        msg.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120*1000, errors: ['time'] })
		.then(collected => {
            antworten.push(collected.first().content);
            counter++;
            message.author.send(fragen[counter]).then(msg => {
                msg.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120*1000, errors: ['time'] })
                .then(collected => {
                    antworten.push(collected.first().content);
                    counter++;
                    message.author.send(fragen[counter]).then(msg => {
                        msg.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120*1000, errors: ['time'] })
                        .then(collected => {
                            antworten.push(collected.first().content);
                            counter++;
                            message.author.send(fragen[counter]).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120*1000, errors: ['time'] })
                                .then(collected => {
                                    antworten.push(collected.first().content);
                                    counter++;
                                    ende_apply();
                                })
                                .catch(collected => {
                                    msg.channel.send('Looks like nobody got the answer this time.');
                                });
                             })
                        })
                        .catch(collected => {
                            msg.channel.send('Looks like nobody got the answer this time.');
                        });
                     })
                })
                .catch(collected => {
                    msg.channel.send('Looks like nobody got the answer this time.');
                });
             })
		})
		.catch(collected => {
			msg.channel.send('Looks like nobody got the answer this time.');
		});
     })
     function ende_apply(){
        const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`${message.author.tag} hat sich beworben!`)
        .setTimestamp()
        .setThumbnail(message.member.user.displayAvatarURL({dynamic: true}))
        .setDescription(`${message.author}`)
        for(let i = 0; i < antworten.length; i++){
        embed.addField(fragen[i], "> " + antworten[i]);
        }
        message.guild.channels.cache.get("797043865567625308").send(embed)
     }
    }
}
