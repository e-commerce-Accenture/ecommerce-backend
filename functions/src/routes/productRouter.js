import { Router } from "express";
import { authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import {
    createProductSchema,
    updateProductSchema,
    addAttributeSchema
} from "../controllers/schemas/productSchema.js";
import { ProductController } from "../controllers/productsController.js";

const productController = new ProductController();
const router = Router();

router
    .post(
        '/',
        validateRequest(createProductSchema),
        authorizationRoles('admin'),
        productController.createProduct
    )
    .get(
        '/',
    
        productController.getProducts
    )
    .get(
        '/:id',
       
        productController.getProductById
    )
    .get(
        '/category/:categoryId',
      
        productController.getProductsByCategory
    )
    .get(
        '/brand/:brand',
        productController.getProductsByBrand
    )
    .patch(
        '/:id',
        validateRequest(updateProductSchema),
        authorizationRoles('admin'),
        productController.updateProduct
    )
    .post(
        '/:id/attributes',
        validateRequest(addAttributeSchema),
        authorizationRoles('admin'),
        productController.addAttribute
    )
    .delete(
        '/:id/attributes/:title',
        authorizationRoles('admin'),
        productController.removeAttribute
    )
    .delete(
        '/:id',
        authorizationRoles('admin'),
        productController.deleteProduct
    );

export default router;