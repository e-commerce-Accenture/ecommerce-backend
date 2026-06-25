import { CategoryAlreadyExists, CategoryNotFound } from "../utils/exceptions.js";
import { v4 as uuidv4 } from "uuid";

export class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async create(name, imgUrl){
        const nameExists = await this.categoryRepository.findByName(name);

        if(nameExists) throw new CategoryAlreadyExists(`Category with name ${name} already exists`);

        const category = await this.categoryRepository.create({
            id: uuidv4(),
            name: name,
            imgUrl: imgUrl
        });

        return category;

    }

    async findAll() {
        const categories = await this.categoryRepository.findAll();

        return categories;
    }

    async findById(id) {
        try {
            const finded = await this.categoryRepository.findById(id);

            if(!finded){
                throw new CategoryNotFound(`Category with id ${id} not found.`);
            }
    
            return finded;
            
        } catch (error) {
            throw error;
        }
    }

    async update(id, data){
        try {
            const isExist = await this.categoryRepository.findById(id);
    
            if(!isExist) throw new CategoryNotFound(`Category with id ${id} not found.`);

            const nameExists = await this.categoryRepository.findByName(data.name);

            if(nameExists && data.name == nameExists.name) throw new CategoryAlreadyExists(`Name ${data.name} already exists`); 

            const updatedCategory = await this.categoryRepository.update(id, data);
        
            return updatedCategory;
            
        } catch (error) {
            throw error;
        }
    }

    async delete(id){
        try {
            const isExist = await this.categoryRepository.findById(id);
    
            if(!isExist) throw new CategoryNotFound(`Category with id ${id} not found.`);
    
            await this.categoryRepository.deleteById(id);
            
        } catch (error) {
            throw error;
        }
    }
}