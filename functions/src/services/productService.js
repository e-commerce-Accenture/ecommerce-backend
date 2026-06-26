import { ProductAlreadyExists, ProductNotFound } from "../utils/exceptions.js";
import { v4 as uuidv4 } from "uuid";

export class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async create(data) {
        const nameExists = await this.productRepository.findByName(data.name);

        if (nameExists) throw new ProductAlreadyExists(`Product with name ${data.name} already exists`);

        const product = await this.productRepository.create({
            id: uuidv4(),
            name: data.name,
            currentPrice: data.currentPrice,
            originalPrice: data.originalPrice,
            discount: data.discount,
            image: data.image,
            categoryId: data.categoryId,
            stock: data.stock,
            brand: data.brand,
            active: data.active ?? true,
            attributes: data.attributes ?? []
        });

        return product;
    }

    async findAll() {
        const products = await this.productRepository.findAll();

        return products;
    }

    async findById(id) {
        try {
            const finded = await this.productRepository.findById(id);

            if (!finded) {
                throw new ProductNotFound(`Product with id ${id} not found.`);
            }

            return finded;

        } catch (error) {
            throw error;
        }
    }

    async findByCategoryId(categoryId) {
        try {
            const products = await this.productRepository.findByCategoryId(categoryId);

            if (!products.length) {
                throw new ProductNotFound(`No products found for categoryId ${categoryId}.`);
            }

            return products;

        } catch (error) {
            throw error;
        }
    }

    async findByBrand(brand) {
        try {
            const products = await this.productRepository.findByBrand(brand);

            if (!products.length) {
                throw new ProductNotFound(`No products found for brand ${brand}.`);
            }

            return products;

        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const isExist = await this.productRepository.findById(id);

            if (!isExist) throw new ProductNotFound(`Product with id ${id} not found.`);

            if (data.name) {
                const nameExists = await this.productRepository.findByName(data.name);

                if (nameExists && data.name == nameExists.name) throw new ProductAlreadyExists(`Name ${data.name} already exists`);
            }

            const updatedProduct = await this.productRepository.update(id, data);

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    }

    async addAttribute(id, attribute) {
        try {
            const isExist = await this.productRepository.findById(id);

            if (!isExist) throw new ProductNotFound(`Product with id ${id} not found.`);

            const updatedProduct = await this.productRepository.addAttribute(id, attribute);

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    }

    async removeAttribute(id, attributeTitle) {
        try {
            const isExist = await this.productRepository.findById(id);

            if (!isExist) throw new ProductNotFound(`Product with id ${id} not found.`);

            const updatedProduct = await this.productRepository.removeAttribute(id, attributeTitle);

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const isExist = await this.productRepository.findById(id);

            if (!isExist) throw new ProductNotFound(`Product with id ${id} not found.`);

            await this.productRepository.deleteById(id);

        } catch (error) {
            throw error;
        }
    }
}