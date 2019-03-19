const SqliteToJson = require('sqlite-to-json');
const sqlite3 = require('sqlite3');
const jsonfile = require('jsonfile')

const exporter = new SqliteToJson({
  client: new sqlite3.Database('./sqlite/songs.sqlite')
});
exporter.all(function (err, all) {
    var fixed = all.songs.map(function(item) {

        var songAuthors = all.authors
        return {
            Title: item.title,
            Authors:  [],
            CCLINumber: item.ccli_number,
            SongKeys: [],
            Links: []
        }
    })
    jsonfile.writeFile("./songs-dump.json", fixed, function (err) {
        if (err) console.error(err)
    })
});