const Discord = require("discord.js"); //
const client = new Discord.Client(); //
const ayarlar = require("./ayarlar.json"); //
const chalk = require("chalk"); //
const moment = require("moment"); //
var Jimp = require("jimp"); //
const { Client, Util } = require("discord.js"); //
const fs = require("fs"); //
const db = require("quick.db"); //
const express = require("express"); //
require("./util/eventLoader.js")(client); //
const path = require("path"); //
const snekfetch = require("snekfetch"); //
//

var prefix = ayarlar.prefix; //
//
const log = message => {
  //
  console.log(`${message}`); //
};

client.commands = new Discord.Collection(); //
client.aliases = new Discord.Collection(); //
fs.readdir("./komutlar/", (err, files) => {
  //
  if (err) console.error(err); //
  log(`${files.length} komut yüklenecek.`); //
  files.forEach(f => {
    //
    let props = require(`./komutlar/${f}`); //
    log(`Yüklenen komut: ${props.help.name}.`); //
    client.commands.set(props.help.name, props); //
    props.conf.aliases.forEach(alias => {
      //
      client.aliases.set(alias, props.help.name); //
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }

  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});
client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

//-----------------------GİRENE-ROL-VERME----------------------\\     STG

client.on("guildMemberAdd", member => {
  member.roles.add("809136132847173683"); // UNREGİSTER ROLÜNÜN İDSİNİ GİRİN
  member.setNickname(`ቾ İsim | Yaş`);
});

//-----------------------GİRENE-ROL-VERME----------------------\\     STG

//------------------------HOŞGELDİN-EMBEDLİ-----------------------\\     STG

client.on("guildMemberAdd", async member => {
  /////////////////////////
  //Kanal Tanımı
  ////////////////////////////////////////
  let viruskanal = client.channels.cache.get("809136254632722432");
  ////////////////////////////////////////
  //Güvenlik TanımlarıS
  ////////////////////////////////////////
  let virususer = client.users.cache.get(member.id);
  let viruskullanıcı = client.users.cache.get(member.id);
  const virushesapkurulus =
    new Date().getTime() - viruskullanıcı.createdAt.getTime();
  let viruj;
  if (virushesapkurulus < 1296000000)
    viruj = " Güvenilir Değil! <a:carp:805740558466940941>";
  if (virushesapkurulus > 1296000000)
    viruj = " Güvenilir! <a:tik:805745554247778314>";

  /////////////////////// /////////////////
  //Embed
  ////////////////////////////////////////
  const hgembed = new Discord.MessageEmbed()
    .setDescription(
      ` <a:yldz:805740409972195349> Aramıza Hoşgeldin **<@${
        member.id
      }>**  ! <a:maviyldz:805740409946636318>
  
     <a:yldz:805740409972195349> Seninle Birlikte **${
       member.guild.memberCount
     }** Kişiyiz <a:maviyldz:805740409946636318>
  
    <a:cekc:805740523264409630> <@&809135813094408293> Rolundekiler Senle En Kısa Zamanda İlgilenicek <a:cekc:805740523264409630>
  
     <a:ates:805740434496159754> İsmini Ve Yaşını Yazıp Kayıt Olabilirsin. <a:ates:805740434496159754>

    <a:ktp:805740404288651295> Hesabın Kuruluş Tarihi ${moment(
      member.user.createdAt
    ).format("**DD MMMM YYYY hh:mm:ss**")} <a:ktp:805740404288651295>
  
    <a:ykleniyo:805745152642777129> Hesabın Güvenlik Durumu: **${viruj}**
  
   <:parnter:805740497267064852> Ayrıca Tagımızı Alarak Bize Destek Olabilirsin **ቾ** <:parnter:805740497267064852>
  `
    )
    .setColor("#2f3136")
    //.setImage("https://images-ext-2.discordapp.net/external/Y5ndqpH_M_czxRPwYwEsXNhCXymiI55TgWOJPA1V_40/https/i.hizliresim.com/pzaBA7.gif")
    .setTitle("Aramıza Yeni Birisi Katıldı !")
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }))
    .setFooter("Kayıt Sistemi");
  ////////////////////////////////////////
  //Kanala Gönderme
  ////////////////////////////////////////
  viruskanal.send(`<@&809135813094408293> <@${member.id}>`, hgembed);
});
//------------------------HOŞGELDİN-EMBEDLİ-----------------------\\     STG

//------------------------ŞÜPHELİ-HESAP-----------------------\\     STG

client.on("guildMemberAdd", member => {
  var moment = require("moment");
  require("moment-duration-format");
  moment.locale("tr");
  var { Permissions } = require("discord.js");
  var x = moment(member.user.createdAt)
    .add(7, "days")
    .fromNow();
  var user = member.user;
  x = x.replace("birkaç saniye önce", " ");
  if (!x.includes("önce") || x.includes("sonra") || x == " ") {
    const kytsz = member.guild.roles.cache.find(
      r => r.id === "809136132847173683"
    );
    var rol = member.guild.roles.cache.get("809135832640258109"); // ŞÜPHELİ HESAP ROLÜNÜN İDSİNİ GİRİN
    var kayıtsız = member.guild.roles.cache.get(kytsz); // UNREGİSTER ROLÜNÜN İDSİNİ GİRİN
    member.roles.add(rol);
    member.roles.remove(kytsz);

    const şüpheli = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(
        `<@${member.id}> adlı kişi Güvenilir Değil <a:carp:805740558466940941>`
      )
      .setTimestamp();
    client.channels.cache.get("810770064952787015").send(şüpheli);

    member.user.send(
      "Selam Dostum Ne Yazık ki Sana Kötü Bir Haberim Var Hesabın 1 Hafta Gibi Kısa Bir Sürede Açıldığı İçin Fake Hesap Katagorisine Giriyorsun Lütfen Bir Yetkiliyle İletişime Geç Onlar Sana Yardımcı Olucaktır."
    );
    setTimeout(() => {}, 1000);
  } else {
  }
});
//------------------------ŞÜPHELİ-HESAP-----------------------\\     STG
//-----------------------TAG-ROL----------------------\\     STG

client.on("userUpdate", async (stg, yeni) => {
  var sunucu = client.guilds.cache.get("809134371223240737"); // Buraya Sunucu ID
  var uye = sunucu.members.cache.get(yeni.id);
  var ekipTag = "ቾ"; // Buraya Ekip Tag
  var ekipRolü = "809135893553610793"; // Buraya Ekip Rolünün ID
  var logKanali = "809136289219739659"; // Loglanacağı Kanalın ID

  if (
    !sunucu.members.cache.has(yeni.id) ||
    yeni.bot ||
    stg.username === yeni.username
  )
    return;

  if (yeni.username.includes(ekipTag) && !uye.roles.cache.has(ekipRolü)) {
    try {
      await uye.roles.add(ekipRolü);
      await uye.send(`Tagımızı aldığın için teşekkürler! Aramıza hoş geldin.`);
      await client.channels.cache
        .get(logKanali)
        .send(
          new Discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${yeni} adlı üye tagımızı alarak aramıza katıldı!`)
        );
    } catch (err) {
      console.error(err);
    }
  }

  if (!yeni.username.includes(ekipTag) && uye.roles.cache.has(ekipRolü)) {
    try {
      await uye.roles.remove(
        uye.roles.cache.filter(
          rol => rol.position >= sunucu.roles.cache.get(ekipRolü).position
        )
      );
      await uye.send(
        `Tagımızı bıraktığın için ekip rolü ve yetkili rollerin alındı! Tagımızı tekrar alıp aramıza katılmak istersen;\nTagımız: **${ekipTag}**`
      );
      await client.channels.cache
        .get(logKanali)
        .send(
          new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(
              `${yeni} adlı üye tagımızı bırakarak aramızdan ayrıldı!`
            )
        );
    } catch (err) {
      console.error(err);
    }
  }
});

//----------------------TAG-KONTROL----------------------\\     STG

client.on("guildMemberAdd", member => {
  let sunucuid = "809134371223240737"; //Buraya sunucunuzun IDsini yazın
  let tag = "ቾ"; //Buraya tagınızı yazın
  let rol = "809135893553610793"; //Buraya tag alındığı zaman verilecek rolün IDsini yazın
  let channel = client.guilds.cache
    .get(sunucuid)
    .channels.cache.find(x => x.name == "Tag Log"); //tagrol-log yerine kendi log kanalınızın ismini yazabilirsiniz
  if (member.user.username.includes(tag)) {
    member.roles.add(rol);
    const tagalma = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(
        `<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, o doğuştan beri bizden !`
      )
      .setTimestamp();
    client.channels.cache.get("809136289219739659").send(tagalma);
  }
});
client.on("ready", () => {
  client.channels.cache.get("810787927889281064").join();
  //main dosyaya atılacak
});
