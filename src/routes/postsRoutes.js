import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { listarPosts, criarNovoPost, uploadImagem, atualizarNovoPost } from '../controllers/postsController.js';

const corsOptions = {
    origin: "http://localhost:8000",
    optionSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ dest: "./uploads" , storage})

const routes = (app) => {
    // Habilita o parser JSON para lidar com requisições com corpo JSON
    app.use(express.json());
    app.use(cors(corsOptions));
    // Rota para lidar com requisições GET para a URL '/posts'
    app.get('/posts', listarPosts);
    // Rota para lidar com requisições POST para a URL '/posts'
    app.post('/posts', criarNovoPost);
    app.post('/upload', upload.single('imagem'), uploadImagem);
    app.put('/upload/:id', atualizarNovoPost);
}

export default routes;