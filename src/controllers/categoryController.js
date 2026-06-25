import { CategoryRepository } from "../repositories/categoryRepository.js";
import { CategoryService } from "../services/categoryService.js";

const repository = new CategoryRepository();
const categoryService = new CategoryService(repository);

export class CategoryController {

    async createCategory(req, res, next) {
        const { name, imgUrl } = req.body

        try {
            const response = await categoryService.create(name, imgUrl)

            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getCategories(_, res, next) {
        try {
            const response = await categoryService.findAll();
            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getCategoryById(req, res, next) {
        const { id } = req.params

        try {
            const response = await categoryService.findById(id);

            return res.status(200).json(response);
        } catch (error) {
            next(error)
        }
    }

    async updateCategory(req, res, next) {
        const { id } = req.params;
        const { name, imgUrl } = req.body

        try {
            const response = await categoryService.update(id, { name, imgUrl })

            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async deleteCategory(req, res, next) {
        const { id } = req.params

        try {
            await categoryService.delete(id)
            return res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}