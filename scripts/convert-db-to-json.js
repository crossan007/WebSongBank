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
exporter.all(function (err, all) {
    var fixed = all.songs.map(function(item) {

        var songAuthors = all.authors
        return {
            Title: item.title,
            Authors:  [],
            CCLINumber: item.ccli_number,
            SongKeys: [],
            Links: [],
            Verses: getVerses(item.lyrics)

        }
    })
    jsonfile.writeFile("./public/songs.json", fixed, function (err) {
        if (err) console.error(err)
    })
});