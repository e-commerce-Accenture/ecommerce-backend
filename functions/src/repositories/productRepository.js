import fs from 'fs'

const file = "./src/repositories/data/products.json"

export class ProductRepository {
    create(data) {
        const newProduct = {
            id: data.id,
            name: data.name,
            currentPrice: data.currentPrice,
            originalPrice: data.originalPrice,
            discount: data.discount,
            image: data.image,
            categoryId: data.categoryId,
            description: data.description,
            stock: data.stock,
            brand: data.brand,
            active: data.active,
            attributes: data.attributes ?? []
        };

        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));

        products.push(newProduct);

        const updatedProducts = JSON.stringify(products, null, 2);

        fs.writeFileSync(file, updatedProducts);

        return newProduct;
    }

    findById(id) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = products.find(p => p.id == id);

        return finded;
    }

    findAll() {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    update(id, data) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = products.findIndex(p => p.id == id);

        products[index] = {
            ...products[index],
            ...(data.name && { name: data.name }),
            ...(data.currentPrice && { currentPrice: data.currentPrice }),
            ...(data.originalPrice && { originalPrice: data.originalPrice }),
            ...(data.discount && { discount: data.discount }),
            ...(data.image && { image: data.image }),
            ...(data.categoryId && { categoryId: data.categoryId }),
            ...(data.description && { description: data.description }),
            ...(data.stock && { stock: data.stock }),
            ...(data.brand && { brand: data.brand }),
            ...(data.active !== undefined && { active: data.active }),
            ...(data.attributes && { attributes: data.attributes })
        };

        const updatedProducts = JSON.stringify(products, null, 2);

        fs.writeFileSync(file, updatedProducts);

        return products[index];
    }

    addAttribute(id, attribute) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = products.findIndex(p => p.id == id);

        products[index].attributes.push(attribute);

        const updatedProducts = JSON.stringify(products, null, 2);

        fs.writeFileSync(file, updatedProducts);

        return products[index];
    }

    removeAttribute(id, attributeTitle) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = products.findIndex(p => p.id == id);

        products[index].attributes = products[index].attributes.filter(
            a => a.title !== attributeTitle
        );

        const updatedProducts = JSON.stringify(products, null, 2);

        fs.writeFileSync(file, updatedProducts);

        return products[index];
    }

    findByName(name) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = products.find(p => p.name == name);

        return finded;
    }

    findByCategoryId(categoryId) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));

        return products.filter(p => p.categoryId == categoryId);
    }

    findByBrand(brand) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));

        return products.filter(p => p.brand == brand);
    }

    deleteById(id) {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = products.findIndex(p => p.id == id);

        products.splice(index, 1);

        const productsUpdated = JSON.stringify(products, null, 2);

        fs.writeFileSync(file, productsUpdated);
    }
}