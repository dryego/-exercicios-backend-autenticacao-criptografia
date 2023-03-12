const express = require('express');
const { cadastroPokemon, atualizarApelidoPokemon, listaPokemons, buscaPokemonId, excluirPokemon } = require('./controladores/pokemons');
const { cadastroUsuario, login } = require('./controladores/usuarios');
const { validadorToken } = require('./filtros/validarToken');


const rotas = express.Router();

rotas.post('/usuario', cadastroUsuario);
rotas.post('/login', login);

rotas.use(validadorToken);

rotas.post('/pokemon', cadastroPokemon);
rotas.put('/pokemon', atualizarApelidoPokemon);
rotas.get('/pokemon', listaPokemons);
rotas.get('/pokemon/:id', buscaPokemonId);
rotas.delete('/pokemon/:id', excluirPokemon);

module.exports = rotas;