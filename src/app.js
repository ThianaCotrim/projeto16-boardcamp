import express from "express";
import cors from "cors";
import jogosRouter from "./routes/jogos.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import alugueisRouter from "./routes/alugueis.routes.js";

const app = express()
app.use(cors())
app.use(express.json())
app.use(jogosRouter)
app.use(clientesRouter)
app.use(alugueisRouter)

const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))