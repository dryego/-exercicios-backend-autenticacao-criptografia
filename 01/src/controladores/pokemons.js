const pool = require('../conexao/conexao')

const cadastroPokemon = async (req, res) => {
    const { nome, abilidades, apelido, imagem } = req.body;
    const { id } = req.usuario;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatorio.' });
    };

    if (!abilidades) {
        return res.status(400).json({ mensagem: 'Abilidades é obrigatorio' });
    };

    if (!apelido) {
        return res.status(400).json({ mensagem: 'O apelido é obrigatorio.' });
    };

    try {

        const verificarNome = await pool.query('select * from pokemons where nome = $1 and usuario_id = $2', [nome, id]);

        if (verificarNome.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Pokemon já cadastrado.' });
        }

        const novoPokemon = await pool.query(
            'insert into pokemons (usuario_id, nome, abilidades, apelido, imagem) values ($1, $2, $3, $4, $5) returning *',
            [id, nome, abilidades, apelido, imagem]);

        return res.status(200).json(novoPokemon.rows);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno.' })
    }
}

const atualizarApelidoPokemon = async (req, res) => {
    const { nome, apelido } = req.body;
    const { id } = req.usuario;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatorio.' });
    };

    if (!apelido) {
        return res.status(400).json({ mensagem: 'O apelido é obrigatorio.' });
    };

    try {

        const buscaPokemon = await pool.query('select * from pokemons where nome = $1 and usuario_id = $2', [nome, id]);
        console.log(buscaPokemon.rows[0]);
        if (buscaPokemon.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Pokemon não localizado.' });
        }

        const atualizarApelido = await pool.query('update pokemons set apelido = $1 where id = $2', [apelido, buscaPokemon.rows[0].id])

        return res.status(200).json({ mensagem: 'Apelido modificado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno.' })
    }

}

const listaPokemons = async (req, res) => {
    const buscarPokemons = await pool.query('select * from pokemons');

    return res.status(200).json(buscarPokemons.rows);
}

const buscaPokemonId = async (req, res) => {
    const { id } = req.params;

    const buscarPokemon = await pool.query('select * from pokemons where id = $1', [id]);

    if (buscarPokemon.rowCount < 1) {
        return res.status(200).json({ mensagem: 'Pokemon não encontrado' });
    }

    return res.status(200).json(buscarPokemon.rows);
}

const excluirPokemon = async (req, res) => {
    const { id } = req.params;

    const buscarPokemon = await pool.query('select * from pokemons where id = $1', [id]);

    if (buscarPokemon.rowCount < 1) {
        return res.status(200).json({ mensagem: 'Pokemon não encontrado' });
    }

    const deletarPokemon = await pool.query('delete from pokemons where id = $1', [id]);

    return res.status(200).json({ mensagem: 'pokemon excluido com sucesso.' })
}


module.exports = {
    cadastroPokemon,
    atualizarApelidoPokemon,
    listaPokemons,
    buscaPokemonId,
    excluirPokemon
}