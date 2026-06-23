import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import cartRouter from './routes/cart.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/userRouter.js';
import errorHandler from './middleware/errorHandler.js';
import AIRouter from './routes/AIRouter.js';

const app = express();
app.use(cors());
app.use(express.json());

// Rotas

app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/users", userRouter);
app.use('/api/ai', AIRouter)
app.use(errorHandler);

// Rotas para quem for juntar

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

})  