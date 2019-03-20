var client = require('scp2');
var ProdConfig = require("./ProdConfig.json");
console.log("uploading");
client.scp('build/**', {
    host: ProdConfig.SSHHost,
    username: ProdConfig.SSHUsername,
    password: ProdConfig.SSHPassword,
    path: ProdConfig.SSHPath
}, function(err) {
    console.log(err)
})
console.log("done uploading");