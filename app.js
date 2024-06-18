const express = require("express");
const app = express();
const tabela2024 = require('./tabela'); 
const path = require('path');
const bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', { tabela2024 });
});

app.get('/pesquisar', (req, res) => {
  const { marca, modelo } = req.query;
  let carrosFiltrados = tabela2024;

  if (marca) {
    const marcaInformada = marca.toLocaleLowerCase();
    carrosFiltrados = carrosFiltrados.filter((infoCarro) => infoCarro.marca === marcaInformada);
  }

  if (modelo) {
    const modeloInformado = modelo.toLocaleLowerCase();
    carrosFiltrados = carrosFiltrados.filter((infoCarro) => infoCarro.modelo === modeloInformado);
  }
  
  if (!carrosFiltrados.length) {
     res
     .status(404)
     .send('Não foram encontrados carros com os critérios de pesquisa informados.');
     return;
  };

  res.render('pesquisar', { tabela2024: carrosFiltrados });
});

app.get('/:modelo/:cor', (req, res) => {
  const corInformada = req.params.cor.toLocaleLowerCase();
  const cor = tabela2024.find((infoCor) => infoCor.cor === corInformada);
  if(!cor) {
    res
    .status(404)
    .send('Não temos essa cor disponível no momento!')
  };
  res.status(200).send(cor);
});

app.put('/interessados/:modelo/:cor/:quantidade', (req, res) => {
  const modeloInformado = req.params.modelo.toLocaleLowerCase();
  const corInformada = req.params.cor.toLowerCase();
  const quantidadeInteressados = parseInt(req.params.quantidade, 10);
  
  const carroSelecionado = tabela2024.find((m) => m.modelo === modeloInformado  && 
  m.cor === corInformada);  
  
  if (!carroSelecionado) {
    res.status(404).send('Esse modelo não existe!');
    return;
  }
  if (isNaN(quantidadeInteressados) || quantidadeInteressados < 0) {
    res.status(400).send('Quantidade de interessados inválida!');
    return;
  }

  carroSelecionado.Interessados = quantidadeInteressados;
  res.status(200).send(carroSelecionado);
});

app.post('/', (req, res) => {
  const novoCarro = req.body;
  tabela2024.push(novoCarro);

  res.status(201).send(novoCarro);
});

app.delete('/:modelo/:cor', (req, res) => {
  const modeloInformado = req.params.modelo.toLocaleLowerCase();
  const corInformada = req.params.cor.toLowerCase();
  const indiceCarroSelecionado = tabela2024.findIndex((m) => m.modelo === modeloInformado &&  m.cor === corInformada);
 
  
  if (indiceCarroSelecionado === -1) { 
    res.status(404).send('Carro não encontrado!');
    return;
  };
  
  const carroRemovido = tabela2024.splice(indiceCarroSelecionado, 1);
  res.status(200).send(carroRemovido);
});

app.listen(300, () => console.log("Servidor rodando na porta 300"));