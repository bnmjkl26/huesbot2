//server
var express = require('express');
var app = express();
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

//bot
var builder = require('botbuilder');

//Korean Dictionary
var kordic = require('./koreanDic');


//=========================================================
// Bot Setup
//=========================================================
// Create chat bot
var connector = new builder.ChatConnector({
//    appId: process.env.MICROSOFT_APP_ID,
//    appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId:'3fb5483a-ebfa-4ebc-a228-51b24adbdfca',
    appPassword:'9ngqh61AeRWwiHiEngoNyG7'
});
var bot = new builder.UniversalBot(connector);
app.post('/api/messages', connector.listen());
//=========================================================
// Bots Dialogs
//=========================================================
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^국어사전/i, [
    function (session) {
        session.beginDialog('/question');
    },
    function (session, results) {
        session.send(session.userData.question);
    }
]);

intents.onDefault([
    function (session) {
        session.send('국어사전 또는 영어사전을 선택하세요');
    }
]);

bot.dialog('/question', [
    function (session) {
        builder.Prompts.text(session, '찾고싶은 단어를 입력하세요.');
    },
    function (session, results) {
        session.userData.question = kordic(results.response);
        session.endDialog();
    }
]);

//=========================================================
// Server Setup
//=========================================================
app.listen(3978, function () {
    console.log('Server listening on port 3978!');
});