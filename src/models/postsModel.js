import 'dotenv/config';
import { ObjectId } from 'mongodb';
import conectarAoBanco from '../config/dbConfig.js'; // Importa a função para conectar ao banco de dados MongoDB

// Conecta ao banco de dados MongoDB usando a string de conexão fornecida pela variável de ambiente STRING_CONEXAO
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para obter todos os posts da coleção 'posts'
export async function getPosts() {
    // Obtém o banco de dados 'RemeDiary'
    const db = conexao.db('RemeDiary');

    // Obtém a coleção 'posts' dentro do banco de dados
    const colecao = db.collection('posts');

    // Busca todos os documentos da coleção e retorna um array
    return colecao.find().toArray();
};

//Cria um novo post no banco de dados RemeDiary
export async function criarPost(novoPost) {
    // Obtém o banco de dados 'RemeDiary'
    const db = conexao.db('RemeDiary');

    // Obtém a coleção 'posts' dentro do banco de dados
    const colecao = db.collection('posts');

    //Insere o novo post na coleção 'posts'
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    
    const db = conexao.db('RemeDiary');    
    const colecao = db.collection('posts');
    const objID = ObjectId.createFromHexString(id);

    
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}