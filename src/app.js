import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { middlewareDeErros } from './middlewares/errors.middleware.js';
import router from './routes/index.js';

const app = express();

app.use(helmet())

app.use(cors({
   origin: ['http://localhost:3000'],
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
   allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(compression({
   level: 6,        // Nível de compressão: 0 (nenhum) a 9 (máximo). 6 é o padrão.
   threshold: 1024, // Só comprime respostas maiores que 1 KB
   filter: (req, res) => {
      // Não comprime se o cliente enviar o cabeçalho x-no-compression
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res); // Comportamento padrão para os demais casos
   },
}))

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

// Middleware de erro — DEVE ter 4 parâmetros
app.use(middlewareDeErros);

export default app
