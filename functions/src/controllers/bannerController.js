import { BannerRepository } from "../repositories/bannerRepository.js";
import { BannerService } from "../services/bannerService.js";

const repository = new BannerRepository();
const bannerService = new BannerService(repository);

export class BannerController {

    async createBanner(req, res, next) {
        const { imgUrl } = req.validated.body;

        try {
            const response = await bannerService.create(imgUrl);

            return res.status(200).json(response)
        } catch (error) {
            next(error);
        }
    }

    async getBanners(_, res, next) {
        try {
            const response = await bannerService.findAll();
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getBannerById(req, res, next) {
        const { id } = req.params;

        try {
            const response = await bannerService.findById(id);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateBanner(req, res, next) {
        const { id } = req.params;
        const { name, imgUrl } = req.validated.body;

        try {
            const response = await bannerService.update(id, imgUrl);

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteBanner(req, res, next) {
        const { id } = req.params;

        try {
            await bannerService.delete(id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}