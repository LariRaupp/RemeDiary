import fs from 'fs';
import {getPosts, criarPost, atualizarPost} from '../models/postsModel.js';
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts (req, res) {
    // Chama a função getPosts() para obter os posts
    const posts = await getPosts();

    // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
    res.status(200).json(posts);
};

// Retorna o post criado ou um erro 500 caso ocorra algum problema
export async function criarNovoPost(req, res) {
    //// Obtém os dados do novo post do corpo da requisição
    const novoPost = req.body;
    try {
        // Chama a função para criar o post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Envia o post criado como resposta
        res.status(200).json(postCriado);
    } catch(erro) {
        // Registra o erro no console e envia uma mensagem de erro genérica
        console.error(erro.message);
        res.status(500).json({'erro': 'falha na requisição'})       
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({'erro': 'falha na requisição'})       
    }
}

export async function atualizarNovoPost(req, res) {
    
    const id = req.params.id;
    const imgUrl = `https://remediary-966376727821.southamerica-east1.run.app/${req.file.filename}`;
    
    try {
        
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const altTxt = await gerarDescricaoComGemini(imgBuffer);
        const postAtualizado = {
            imgUrl: urlImagem,
            descricao: req.body.descricao,
            alt: altTxt
        }
        const postCriado = await atualizarPost(id, postAtualizado);        
        
        res.status(200).json(postCriado);
    } catch(erro) {
        
        console.error(erro.message);
        res.status(500).json({'erro': 'falha na requisição'})       
    }
}