import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRouter.js';
import AIRouter from './routes/AIRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import bannerRouter from './routes/bannerRouter.js'
import productRouter from './routes/productRouter.js';
import errorHandler from './middleware/errorHandler.js';
import registerRouter from './routes/registerRouter.js'
import profileRouter from './routes/profileRouter.js'
import { authMiddleware } from './middleware/auth.js';
import { setupSwagger } from './docs/swagger.js';


const app = express();
app.use(cors());
app.use(express.json());
setupSwagger(app)

app.use("/auth", authRouter);
app.use("/users/register", registerRouter)
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/banners", bannerRouter);
app.use(authMiddleware);
app.use("/users", userRouter);
app.use('/profile', profileRouter)
app.use("/cart", cartRouter);
app.use('/ai', AIRouter)
app.use(errorHandler);

export default app;
