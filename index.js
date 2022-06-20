// inicia o projeto com o express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const connection = require("./database/database");
const Card = require("./database/Card");
const API = require("./database/API");
const List = require("./database/List");
const Member = require("./database/Member");
const Action = require("./database/Action");



// Conexão Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

// define o EJS como View Engine/renderizador
app.set('view engine', 'ejs');
app.use(express.static('public'));

// é o responsavel por decodificar os dados
app.use(bodyParser.urlencoded({extended: false}));
// permite ler dados de formularios enviados via json
app.use(bodyParser.json());

// cria as rotas

// insere na pagina inicial somente o primeiro formulário para alteração das informações
/*app.get("/", (req,res) =>{
    res.render("index")
});
*/


app.get("/", (req,res) =>{
    API.findAll({raw:true, order:[
        ['name'] // indica por qual campo eu quero ordenar e se asc ou desc
    ]}).then(apis =>{
        //console.log(APIs);
        res.render("index", {
            apis: apis
        });
    });
});

app.get("/API", (req, res) => {
    res.render("API")
});


app.post("/registerAPI", (req, res) => {
    var name = req.body.name;
    var APIKey = req.body.APIKey;
    var APIToken = req.body.APIToken;
    var idBoard = req.body.idBoard;

    API.create({ // insere no BD as variaveis registradas acima e no Form da pag HTML
        name: name,
        APIKey: APIKey,
        APIToken: APIToken,
        idBoard: idBoard
    }).then(() => {
        res.redirect("/"); // apos salvar no BD volta pra página principal
    })
});

app.get("/trello/:id", (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/"); 
    }

    API.findByPk(id).then(apis => {
        if(apis != undefined){
            res.render("trello",{apis: apis});
        }else{
            res.redirect("/");
        }
    }).catch(erro => {
        res.redirect("/");        
    })
});


app.get("/exportCard/:APIKey/:APIToken/:idBoard", (req, res) => {
    var APIKey = req.params.APIKey;
    var APIToken = req.params.APIToken;
    var id = req.params.idBoard;
    

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

            /*
            //console.log(Array.isArray(jsonText)); verifica se é um array
            console.log('-');
            console.log('ID: '   + id);
            console.log('Desc: ' + name);
            console.log('Json: ' + jsonText[i]);
            */
            Card.create({ 
              json_id: id,
              name: name,
              idList: idList,
              idBoard: idBoard,
              desc: desc,
              dateLastActivity: dateLastActivity,
              json: json
            }).then(() => {
                //res.send('Dados inseridos com sucesso');
                console.log('Dados inseridos com sucesso');
            });
        }
    })
    .catch(err => console.error(err));

    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h2>Dados inseridos com sucesso</h2>'));
});


app.get("/exportList/:APIKey/:APIToken/:idBoard", (req, res) => {
    var APIKey = req.params.APIKey;
    var APIToken = req.params.APIToken;
    var id = req.params.idBoard;

    fetch(`https://api.trello.com/1/boards/${id}/lists?key=${APIKey}&token=${APIToken}`, {
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

        console.log('Total Registros Lists: ' + jsonText.length);

        // loop acessa todos os registros do board
        for (i = 0; i < jsonText.length; i++) {
            
            var id = jsonText[i].id;
            var name = jsonText[i].name;
            var idBoard = jsonText[i].idBoard;
            var json = jsonText[i];

            /*
            //console.log(Array.isArray(jsonText)); verifica se é um array
            console.log('-');
            console.log('ID: '   + id);
            console.log('Desc: ' + name);
            console.log('Json: ' + jsonText[i]);
            */
            List.create({ 
              json_id: id,
              name: name,
              idBoard: idBoard,
              json: json
            }).then(() => {
                //res.send('Dados inseridos com sucesso');
                console.log('Dados inseridos com sucesso');
            });
        }
    })
    .catch(err => console.error(err));

    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h2>Dados inseridos com sucesso</h2>'));
});


app.get("/exportAction/:APIKey/:APIToken/:idBoard", (req, res) => {
    var APIKey = req.params.APIKey;
    var APIToken = req.params.APIToken;
    var id = req.params.idBoard;


    // a partir de todos os cards da board irá selecionar as actions
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

        console.log('Total Registros Cards: ' + jsonText.length);

        // loop acessa todos os registros do board
        for (i = 0; i < jsonText.length; i++) {
            
            var id = jsonText[i].id;
            
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
                console.log(jsonText);

                console.log('Total Registros Actions: ' + jsonText.length);

                // loop acessa todos os registros do board
                for (i = 0; i < jsonText.length; i++) {
                    
                    var id = jsonText[i].id;
                    var idMemberCreator = jsonText[i].idMemberCreator;
                    var text = jsonText[i].data.text;
                    var type = jsonText[i].type;
                    var date = jsonText[i].date;
                    var idCard = jsonText[i].data.card.id;
                    var idBoard = jsonText[i].data.board.id;
                    var idList = jsonText[i].data.list.id;
                    var idMember = jsonText[i].memberCreator.id;
                    var json = jsonText[i];

                    
                    //console.log(Array.isArray(jsonText)); verifica se é um array
                    //console.log('-');
                    console.log('ID: '   + idCard);
                    //console.log('Desc: ' + name);
                    //console.log('Json: ' + jsonText[i]);
                    
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
                }
            })
            .catch(err => console.error(err));
        }
    })
    .catch(err => console.error(err));
    

    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h2>Dados inseridos com sucesso</h2>'));
});




app.get("/exportMember/:APIKey/:APIToken/:idBoard", (req, res) => {
    var APIKey = req.params.APIKey;
    var APIToken = req.params.APIToken;
    var id = req.params.idBoard;

    fetch(`https://api.trello.com/1/boards/${id}/members?key=${APIKey}&token=${APIToken}`, {
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

        console.log('Total Registros Members: ' + jsonText.length);

        // loop acessa todos os registros do board
        for (i = 0; i < jsonText.length; i++) {
            
            var id = jsonText[i].id;
            var fullName = jsonText[i].fullName;
            var json = jsonText[i];

            /*
            //console.log(Array.isArray(jsonText)); verifica se é um array
            console.log('-');
            console.log('ID: '   + id);
            console.log('Desc: ' + name);
            console.log('Json: ' + jsonText[i]);
            */
            Member.create({ 
              json_id: id,
              fullName: fullName,
              json: json
            }).then(() => {
                //res.send('Dados inseridos com sucesso');
                console.log('Dados inseridos com sucesso');
            });
        }
    })
    .catch(err => console.error(err));

    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h2>Dados inseridos com sucesso</h2>'));
});



/*
// parametros obrigatórios
app.get("/ola/:nome/:empresa", function(req,res){
    // REQ => dados enviados pelo usuário
    // RES => dados enviados AO usuário
    var nome = req.params.nome;
    var empresa = req.params.empresa;

    res.send("<h1>Oi  " +  nome + " do " + empresa + "</h1>")

});

/*
// cria as rotas
app.get("/", (req,res) =>{
    Card.findAll({raw:true, order:[
        ['id', 'name'] // indica por qual campo eu quero ordenar e se asc ou desc
    ]}).then(cards =>{
        //console.log(perguntas);
        res.render("index", {
            cards: cards
        });
    });
});

/*
// criou uma rota para a pagina de registrar perguntas
app.get("/perguntar", (req, res) => {
    res.render("perguntar")
});

// deve usar o mesmo método do formulário ao enviar as perguntas
app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({ // insere no BD as variaveis registradas acima e no Form da pag HTML
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/"); // apos salvar no BD volta pra página principal
    })
});

app.get("/pergunta/:id", (req,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id} // abre o where e informa qual valor eu quero buscar no banco comparando com uma variavel declarada
    }).then(pergunta => {
        if (pergunta != undefined) { // pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
        } else { // nao encontrada
            res.redirect("/")
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    })
});
*/

app.listen(8080, () =>{
    console.log("App rodando");
});

