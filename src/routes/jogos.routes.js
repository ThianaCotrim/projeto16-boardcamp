import { Router } from "express";
import {getJogos, inserirJogo} from "../controllers/jogos.controllers.js"

const jogosRouter = Router()


jogosRouter.get("/games", getJogos)
jogosRouter.post("/games", inserirJogo)


export default jogosRouter