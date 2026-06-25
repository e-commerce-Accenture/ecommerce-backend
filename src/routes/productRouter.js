import { Router } from "express";
import { getProdutos, getProdutoPorId, getProdutosCancelados, criarProduto, atualizarProduto, deletarProduto, reativarProduto } from "../controllers/productsController.js";
import { authorizationRoles } from "../middleware/auth.js";


const router = Router();

router.get("/", getProdutos);
router.get("/cancelados", authorizationRoles("admin"), getProdutosCancelados);
router.get("/:id", getProdutoPorId);
router.post("/", authorizationRoles("admin"), criarProduto);
router.patch("/:id", authorizationRoles("admin"), atualizarProduto);
router.patch("/:id/reativar", authorizationRoles("admin"), reativarProduto);
router.delete("/:id", authorizationRoles("admin"), deletarProduto);

export default router;
