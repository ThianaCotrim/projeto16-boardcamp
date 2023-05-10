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

    const jogoExistente = await db.query (`SELECT * FROM games WHERE name =$1`, [name])

    if(!jogoExistente.rows) return res.sendStatus(409)

    try {
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, 
        [name, image, stockTotal, pricePerDay])
        return res.sendStatus(201)
    } catch (err){
        res.status(500).send(err.message)
    }
    
}
