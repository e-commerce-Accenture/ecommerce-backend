import { ProductRepository } from "../repositories/productRepository.js";
import { ProductService } from "../services/productService.js";

const repository = new ProductRepository();
const productService = new ProductService(repository);

export class ProductController {

    async createProduct(req, res, next) {
        const {
            name,
            currentPrice,
            originalPrice,
            discount,
            image,
            categoryId,
            description,
            stock,
            brand
        } = req.validated.body;

        try {
            const response = await productService.create({
                name,
                currentPrice,
                originalPrice,
                discount,
                image,
                categoryId,
                description,
                stock,
                brand
            });

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(_, res, next) {
        try {
            const response = await productService.findAll();

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        const { id } = req.params;

        try {
            const response = await productService.findById(id);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProductsByCategory(req, res, next) {
        const { categoryId } = req.params;

        try {
            const response = await productService.findByCategoryId(categoryId);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProductsByBrand(req, res, next) {
        const { brand } = req.params;

        try {
            const response = await productService.findByBrand(brand);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        const { id } = req.params;

        const {
            name,
            currentPrice,
            originalPrice,
            discount,
            image,
            categoryId,
            description,
            stock,
            brand,
            active
        } = req.validated.body;

        try {
            const response = await productService.update(id, {
                name,
                currentPrice,
                originalPrice,
                discount,
                image,
                categoryId,
                description,
                stock,
                brand,
                active
            });

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async addAttribute(req, res, next) {
        const { id } = req.params;
        const { title, paragraph } = req.validated.body;

        try {
            const response = await productService.addAttribute(id, {
                title,
                paragraph
            });

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async removeAttribute(req, res, next) {
        const { id, title } = req.params;

        try {
            const response = await productService.removeAttribute(id, title);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        const { id } = req.params;

        try {
            await productService.delete(id);

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}