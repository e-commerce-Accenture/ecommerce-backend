const { Router } = require("express");
const { getProdutos, criarProduto, deletarProduto } = require("../controllers/productsController");


const router = Router();

router.get("/", getProdutos);
router.post("/", criarProduto);
router.delete("/:id", deletarProduto);

module.exports = router;