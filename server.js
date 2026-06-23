const express = require('express');
const cors =  require('cors');

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Rotas

app.use("/api/auth", require('./src/routes/auth'));
app.use("/api/cart", require('./src/routes/cart'));

// Rotas para quem for juntar


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
})  