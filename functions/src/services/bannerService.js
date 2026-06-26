import bcrypt from "bcryptjs";
import { BannerNotFound } from "../utils/exceptions.js";
import { v4 as uuidv4 } from "uuid";

export class BannerService {
    constructor(bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    async create(imgUrl) {
        const banner = await this.bannerRepository.create({
            id: uuidv4(),
            imgUrl: imgUrl
        });

        return banner;
    }

    async findAll() {
        const banners = await this.bannerRepository.findAll();

        return banners;
    }

    async findById(id) {
        try {
            const banner = await this.bannerRepository.findById(id);

            if (!banner) {
                throw new BannerNotFound(`Banner with id ${id} not found.`);
            }

            return banner;

        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const banner = await this.bannerRepository.findById(id);

            if (!banner) throw new BannerNotFound(`Banner with id ${id} not found.`);

            const updatedBanner = await this.bannerRepository.update(id, data);

            return updatedBanner;

        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const isExist = await this.bannerRepository.findById(id);

            if (!isExist) throw new BannerNotFound(`Banner with id ${id} not found.`);

            await this.bannerRepository.deleteById(id);

        } catch (error) {
            throw error;
        }
    }
}