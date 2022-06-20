// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');
const Card = require("./database/Card");

const APIKey = '615cb717bfd0972f56b65744bb6cf87c';
const APIToken = 'dfc7336a052dc4894269e9bf8b927904f5f1efdb036ad50baf5ba13181a049f0';
const id = '62a390c00b9c760da7c4534b';

fetch(`https://api.trello.com/1/boards/${id}/cards?key=${APIKey}&token=${APIToken}`, {
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

        console.log('Total Registros Board: ' + jsonText.length);

        // loop acessa todos os registros do board
        for (i = 0; i < jsonText.length; i++) {
            var id = jsonText[i].id;
            var name = jsonText[i].name;
            var idList = jsonText[i].idList;
            var idBoard = jsonText[i].idBoard;
            var desc = jsonText[i].desc;
            var dateLastActivity = jsonText[i].dateLastActivity;
            var json = jsonText[i];
    
            //console.log(Array.isArray(jsonText)); verifica se é um array
            console.log('-');
            console.log('ID: '   + id);
            console.log('Desc: ' + name);
            console.log('Json: ' + jsonText[i]);

            Card.create({ 
              json_id: id,
              name: name,
              idList: idList,
              idBoard: idBoard,
              desc: desc,
              dateLastActivity: dateLastActivity,
              json: json
            }).then(() => {
                console.log ('Dados inseridos com sucesso')
            });
        }
    })
  .catch(err => console.error(err));





