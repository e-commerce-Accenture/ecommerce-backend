const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const cartsPath = path.join(__dirname, '../data/carts.json');
const productsPath = path.join(__dirname, '../data/products.json');

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
        return res.status(404).json({ message: 'Produto não encontrado' });
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
        return res.status(404).json({ message: 'Item não encontrado no carrinho' });
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
        return res.status(404).json({ message: 'Item não encontrado no carrinho' });
    }

    cart = cart.filter(i => i.productId !== id);
    saveCart(cart);
    res.json({ message: 'Produto removido do carrinho', cart });
});

module.exports = router;