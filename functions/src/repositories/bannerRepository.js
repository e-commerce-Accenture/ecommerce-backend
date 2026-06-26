import fs from 'fs'

const file = "./src/repositories/data/banners.json"

export class BannerRepository {
    create(data) {
        const newBanner = {
            id: data.id,
            imgUrl: data.imgUrl
        };

        const banners = JSON.parse(fs.readFileSync(file, 'utf-8'));

        banners.push(newBanner);

        const updatedBanners = JSON.stringify(banners, null, 2);

        fs.writeFileSync(file, updatedBanners)

        return newBanner;

    }

    findById(id) {
        const banners = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = banners.find(b => b.id === id);

        return finded;
    }

    findAll() {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    update(id, imgUrl) {
        const banners = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = banners.findIndex(b => b.id == id);

        banners[index] = {
            ...banners[index],
            ...(imgUrl && { imgUrl: imgUrl })
        };

        const bannersUpdated = JSON.stringify(banners, null, 2);

        fs.writeFileSync(file, bannersUpdated);

        return banners[index];
    }

    deleteById(id) {
        const banners = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = banners.findIndex(b => b.id == id);

        banners.splice(index, 1);

        const bannersUpdated = JSON.stringify(banners, null, 2);

        fs.writeFileSync(file, bannersUpdated);
    }
}