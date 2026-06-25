import { Router } from "express";
import { getProdutos, getProdutoPorId, getProdutosCancelados, criarProduto, atualizarProduto, deletarProduto, reativarProduto } from "../controllers/productsController.js";
import { authMiddleware, authorizationRoles } from "../middleware/auth.js";


const router = Router();

router.get("/", getProdutos);
router.get("/cancelados", authMiddleware,authorizationRoles("admin"), getProdutosCancelados);
router.get("/:id", getProdutoPorId);
router.post("/", authMiddleware, authorizationRoles("admin"), criarProduto);
router.patch("/:id", authMiddleware, authorizationRoles("admin"), atualizarProduto);
router.patch("/:id/reativar", authMiddleware, authorizationRoles("admin"), reativarProduto);
router.delete("/:id", authMiddleware, authorizationRoles("admin"), deletarProduto);

export default router;
