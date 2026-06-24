import fs from 'fs'

const file = "./src/repositories/data/cart.json"

export class CartRepository {
    create(data) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));

        const newCart = {
            id: data.id,
            userId: data.userId,
            items: []
        }

        carts.push(newCart);

        fs.writeFileSync(file, JSON.stringify(carts, null, 2));

        return data;
    }

    findByProductId(productId) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = carts.find(c => c.productId === productId);
        return finded;
    }

    findByUserId(userId) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = carts.find(c => c.userId === userId);
        return finded;
    }

    findAll() {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    updateItem(id, productId, quantity) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const cart = carts.find(c => c.id === id);

        const itemIndex = cart.items.findIndex(i => i.productId === productId)

        if (itemIndex === -1) {
            return null;
        }

        cart.items[itemIndex] = {
            ...cart.items[itemIndex],
            ...(quantity && { quantity: quantity })
        };

        fs.writeFileSync(file, JSON.stringify(carts, null, 2));

        return cart.items[itemIndex];

    }

    deleteItem(userId, productId) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const cart = carts.find(c => c.userId === userId);

        const itemIndex = cart.items.findIndex(i => i.productId === productId);

        if (itemIndex === -1) {
            return null;
        }

        cart.items.splice(itemIndex, 1);

        fs.writeFileSync(file, JSON.stringify(carts, null, 2));
    }
}