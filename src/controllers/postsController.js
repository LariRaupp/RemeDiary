import fs from 'fs';
import { getPosts, criarPost, atualizarPost } from '../models/postsModel.js';
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    const posts = await getPosts();
    res.status(200).json(posts);
};

export async function criarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ 'erro': 'falha na requisição' });
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: "",
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
    
        // Atualizar o campo imgUrl
        const imgUrl = `${req.protocol}://${req.get('host')}/${imagemAtualizada}`;
        await atualizarPost(postCriado.insertedId, { imgUrl });
    
        // Retornar a resposta correta
        res.status(200).json({ ...postCriado, imgUrl });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ 'erro': 'falha na requisição' });
    }
}    

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const imgUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const altTxt = await gerarDescricaoComGemini(imgBuffer);
        const postAtualizado = {
            imgUrl: imgUrl,
            descricao: req.body.descricao,
            alt: altTxt
        };

        const postCriado = await atualizarPost(id, postAtualizado);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ 'erro': 'falha na requisição' });
    }
}
