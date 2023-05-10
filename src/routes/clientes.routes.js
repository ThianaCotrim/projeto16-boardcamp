import { Router } from "express";
import {getClientes, getClientesById, inserirClientes, editClientesById} from "../controllers/clientes.controllers.js"

const clientesRouter = Router()

clientesRouter.get("/customers", getClientes)
clientesRouter.get("/customers/:id", getClientesById)
clientesRouter.post("/customers", inserirClientes)
clientesRouter.put("/customers/:id", editClientesById)

export default clientesRouter