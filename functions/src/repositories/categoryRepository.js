import fs from 'fs'

const file = "./src/repositories/data/categories.json"

export class CategoryRepository {
    create(data) {
        const newCat = {
            id: data.id,
            name: data.name,
            imgUrl: data.imgUrl
        };

        const categories = JSON.parse(fs.readFileSync(file, 'utf-8'));

        categories.push(newCat);

        const updatedCategories = JSON.stringify(categories, null, 2);

        fs.writeFileSync(file, updatedCategories)

        return newCat;
    }

    findById(id) {
        const categories = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = categories.find(c => c.id == id);

        return finded;
    }

    findAll() {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    update(id, data) {
        const categories = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = categories.findIndex(c => c.id == id);

        categories[index] = {
            ...categories[index],
            ...(data.name && { name: data.name }),
            ...(data.imgUrl && { imgUrl: data.imgUrl })
        };

        const updatedCategories = JSON.stringify(categories, null, 2);

        fs.writeFileSync(file, updatedCategories);

        return categories[index];
    }

    findByName(name) {
        const categories = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = categories.find(c => c.name == name);

        return finded;
    }

    deleteById(id) {
        const categories = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = categories.findIndex(c => c.id == id);

        categories.splice(index, 1);

        const categoriesUpdated = JSON.stringify(categories, null, 2);

        fs.writeFileSync(file, categoriesUpdated);
    }
}