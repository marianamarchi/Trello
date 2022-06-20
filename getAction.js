// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');
const Card = require("./database/Card");

const APIKey = '615cb717bfd0972f56b65744bb6cf87c';
const APIToken = 'dfc7336a052dc4894269e9bf8b927904f5f1efdb036ad50baf5ba13181a049f0';
const id = '62a390ce9d06380ed626eab5';


// chama a api das actions
fetch(`https://api.trello.com/1/cards/${id}/actions?key=${APIKey}&token=${APIToken}`, {
    method: 'GET'   
})
.then(response => {
    console.log(
    `Response: ${response.status} ${response.statusText}`
    );

    return response.text(); // returns json
})
.then(text => {
    const jsonText = JSON.parse(text);
    //console.log(jsonText);

    console.log('Total Registros Actions: ' + jsonText.length);

    // loop acessa todos os registros do board
    for (i = 0; i < jsonText.length; i++) {
        
        var id = jsonText[i].id;
        var idMemberCreator = jsonText[i].idMemberCreator;
        var text = jsonText[i].text;
        var type = jsonText[i].type;
        var date = jsonText[i].date;
        //var jsonCard = JSON.parse(jsonText[i].card);
        //var idCard = jsonText[i].jsonCard.id;
        //var idBoard = jsonText[i].board;
        //var idList = jsonText[i].list;
        //var idMember = jsonText[i].memberCreator.id;
        //var json = jsonText[i];
        
        console.log (jsonText[i]);
        console.log(jsonText[i].data.card.id);
        
        /*
        Action.create({ 
        json_id: id,
        idMemberCreator: idMemberCreator,
        text: text,
        type: type,
        date: date,
        idCard: idCard,
        idBoard: idBoard,
        idList: idList,
        idMember: idMember,
        json: json
        }).then(() => {
            //res.send('Dados inseridos com sucesso');
            console.log('Dados inseridos com sucesso');
        });
        */
    }
})
.catch(err => console.error(err));


