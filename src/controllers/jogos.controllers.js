import { db }  from "../database/database.connection.js"

export async function getJogos(req, res){

    try{
        const jogos = await db.query(`SELECT * FROM games;`)
        res.send(jogos.rows).status(200)
    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function inserirJogo(req, res){

    const {name, image, stockTotal, pricePerDay} = req.body

    if (name === '') return res.status(400).send("O nome do jogo não pode estar vazio")

    if (stockTotal <= 0 || pricePerDay <= 0) return res.status(400)
    .send("O estoque ou o preço não podem ser menores que 0")
    
    const nameExistente = await db.query (`SELECT * FROM games WHERE name = $1;`, [name])
    if (nameExistente.rows.length) return res.status(409).send("Jogo já existente, escolha outro nome")

    try {
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, 
        [name, image, stockTotal, pricePerDay])
        return res.sendStatus(201)
    } catch (err){
        res.status(400).send(err.message)
    }
    
}
