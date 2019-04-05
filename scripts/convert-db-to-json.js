const SqliteToJson = require('sqlite-to-json');
const sqlite3 = require('sqlite3');
const jsonfile = require('jsonfile')
const libxmljs = require("libxmljs");

const exporter = new SqliteToJson({
  client: new sqlite3.Database('./sqlite/songs.sqlite')
});
const getVerses = function(cdata) {
    var XMLDoc = libxmljs.parseXml(cdata);
    var verses = XMLDoc.find("//verse");
    var verseTexts = verses.map(function(verse) {
        return verse.text() ;
    });
       
    return verseTexts;
}

const getKeys = function(data) { 
    const keys = ["C","B","A","G","F","E","D"];
    const vocalists = ["Anna","Amanda","Matt", "Dan", "Bill","Lindsey","Marybeth"];
    const YoutubeLinks = [
        {
            URL: 'https://www.youtube.com/watch?v=06yMHnoV0Rg',
            Title: "Live Stream 4/1/2019"
        },
        {
            URL: 'https://www.youtube.com/watch?v=06yMHnoV0Rg',
            Title: "Live Stream 3/26/2019"
        },
        {
            URL: 'https://www.youtube.com/watch?v=06yMHnoV0Rg',
            Title: "Live Stream 3/18/2019"
        },
        {
            URL: 'https://www.youtube.com/watch?v=06yMHnoV0Rg',
            Title: "Live Stream 3/1/2019"
        }
    ]

    var SongKeys = [];
    var KeysToPopulate = Math.max(Math.floor(Math.random() * keys.length),1);
    for (var i=0; i<KeysToPopulate; i++ ) {
      
        var KeyToPopulate = keys[Math.floor(Math.random() * keys.length)];
        var VocalistsToPreferKey = Math.max(Math.floor(Math.random() * vocalists.length),1);
        var KeyVocalists = [];
        var LinksToInclude = Math.max(Math.floor(Math.random() * YoutubeLinks.length),1);
        var Links = [];
        for (y=0; y<VocalistsToPreferKey; y++)
        {
            var VocalistToPreferKey = vocalists[Math.floor(Math.random() * vocalists.length)];
            KeyVocalists.push(VocalistToPreferKey);
        }
        for (y=0; y<LinksToInclude; y++)
        {
            var Link = YoutubeLinks[Math.floor(Math.random() * YoutubeLinks.length)];
            Links.push(Link);
        }
        SongKeys.push({
            Key: KeyToPopulate,
            PreferredBy: KeyVocalists,
            Links: Links
        });
    }
   return SongKeys;
}

const getSong = function(item, all) { 
    var songAuthors = all.authors
    return {
        Title: item.title,
        Authors:  [],
        CCLINumber: item.ccli_number,
        SongKeys: getKeys(item),
        Links: [],
        Verses: getVerses(item.lyrics)

    }
}

exporter.all(function (err, all) {
    var fixed = all.songs.map(function(item) {
        return getSong(item, all);       
    })
    jsonfile.writeFile("./public/songs.json", fixed, function (err) {
        if (err) console.error(err)
    })
});