import { Router } from 'express';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

import messages from '../utils/messages.js';
import { NotFoundException } from '../utils/exceptions.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Corrigir o caminho relativo pra arquivos JSON
const cartsPath = path.join(__dirname, '../repositories/data/carts.json');
const productsPath = path.join(__dirname, '../repositories/data/products.json');

// Funções auxiliares
const getCart = () => {
    const data = fs.readFileSync(cartsPath, 'utf-8');
    return JSON.parse(data || '[]');
};

const saveCart = (cart) => {
    fs.writeFileSync(cartsPath, JSON.stringify(cart, null, 2));
};

const getProducts = () => {
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
};

// GET /api/cart — lista o carrinho
router.get('/', (req, res) => {
    const cart = getCart();
    res.json(cart);
});

// POST /api/cart — adiciona produto ao carrinho
router.post('/', (req, res) => {
    const { productId, quantity } = req.body;

    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        // Code: 404, Exception: O produto não existe na base de dados.
        throw new NotFoundException(messages.product.NOT_FOUND);
    }

    const cart = getCart();
    const itemExists = cart.find(item => item.productId === productId);

    if (itemExists) {
        itemExists.quantity += quantity;
    } else {
        cart.push({
            productId,
            name: product.name,
            price: product.price,
            quantity
        });
    }

    saveCart(cart);
    res.status(201).json({ message: 'Produto adicionado ao carrinho', cart });
});

// PATCH /api/cart/:id — atualiza quantidade
router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const cart = getCart();
    const item = cart.find(i => i.productId === id);

    if (!item) {
        // Code: 404, Exception: O item não existe no carrinho.
        throw new NotFoundException(messages.cart.ITEM_NOT_FOUND);
    }

    item.quantity = quantity;
    saveCart(cart);
    res.json({ message: 'Quantidade atualizada', cart });
});

// DELETE /api/cart/:id — remove produto
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    let cart = getCart();
    const itemExists = cart.find(i => i.productId === id);

    if (!itemExists) {
        // Code: 404, Exception: O item não existe no carrinho.
        throw new NotFoundException(messages.cart.ITEM_NOT_FOUND);
    }

    cart = cart.filter(i => i.productId !== id);
    saveCart(cart);
    res.json({ message: 'Produto removido do carrinho', cart });
});

export default router