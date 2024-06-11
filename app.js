import express from 'express';
import tabela2024 from './tabela.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send(tabela2024);
});


app.get('/marca/:marca', (req, res) => {
  const marcaInformada = req.params.marca.toLocaleLowerCase();
  const carro = tabela2024.filter((infoCarro) => infoCarro.marca === marcaInformada);
  if (!carro.length === 0) {
     res
     .status(404)
     .send('Essa marca não existe!');
     return;
  };
  res.status(200).send(carro);
 });
 
app.get('/modelo/:modelo', (req, res) => {
 const modeloInformado = req.params.modelo.toLocaleLowerCase();
 const carro = tabela2024.filter((infoCarro) => infoCarro.modelo === modeloInformado);
 if (!carro) {
    res
    .status(404)
    .send('Esse modelo não existe!');
    return;
 };
 res.status(200).send(carro);
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