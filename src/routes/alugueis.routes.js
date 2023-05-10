import { Router } from "express";
import {getAlugueis, inserirAlugueis, finalizarAlugueis, apagarAlugueis} from "../controllers/alugueis.controllers.js"

const alugueisRouter = Router()

alugueisRouter.get("/rentals", getAlugueis)
alugueisRouter.post("/rentals", inserirAlugueis)
alugueisRouter.post("/rentals/:id/return", finalizarAlugueis)
alugueisRouter.delete("/rentals/:id", apagarAlugueis)

export default alugueisRouter