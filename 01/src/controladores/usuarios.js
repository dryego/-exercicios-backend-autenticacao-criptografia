const pool = require('../conexao/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = require('../senha');

const cadastroUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatorio.' });
    };

    if (!email) {
        return res.status(400).json({ mensagem: 'O e-mail é obrigatorio.' });
    };

    if (!senha) {
        return res.status(400).json({ mensagem: 'O senha é obrigatorio.' });
    };

    try {

        const verificarEmail = await pool.query('select * from usuarios where email = $1', [email]);

        if (verificarEmail.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Usuario ja cadastrado.' });
        }

        const senhacriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
            [nome, email, senhacriptografada]);

        return res.status(200).json(novoUsuario.rows);


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno.' })
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const buscarUsuario = await pool.query('select * from usuarios where email = $1', [email]);

        if (buscarUsuario.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Usuario ou senha invalidos.' });
        }

        const validarSenha = await bcrypt.compare(senha, buscarUsuario.rows[0].senha);

        if (!validarSenha) {
            return res.status(400).json({ mensagem: 'Usuario ou senha invalidos.' });
        }

        const token = jwt.sign({ id: buscarUsuario.rows[0].id }, key, { expiresIn: '8h' });

        const { senha: _, ...usuario } = buscarUsuario.rows[0];

        return res.status(200).json({ usuario, token });


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno.' });
    }

}

module.exports = {
    cadastroUsuario,
    login
}