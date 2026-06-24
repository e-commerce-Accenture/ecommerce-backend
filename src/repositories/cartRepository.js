import fs from 'fs'

const file = "./src/repositories/data/carts.json"

export class CartRepository {
    create(cart) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));

        carts.push(cart);

        fs.writeFileSync(file, JSON.stringify(carts, null, 2));

        return cart;
    }

    findByProductId(productId) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = carts.find(c => c.productId === productId);
        return finded;
    }

    findAll() {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    update(productId, data ) {
        const carts = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = carts.findIndex(u => u.productId === productId);

        if(index === -1) {
            return null;
        }

        carts[index] = {
            ...carts[index],
            ...data
        };

        fs.writeFileSync(file, JSON.stringify(carts, null, 2));

        return carts[index];

    }

    delete(productId) {
        const carts  = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = carts.findIndex(u => u.productId === productId);

        if(index === -1) {
            return null;
        }

        carts.splice(index, 1);

        fs.writeFileSync(file, JSON.stringify(carts, null, 2));

        return true;
    }
}