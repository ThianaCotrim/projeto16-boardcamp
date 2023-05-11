import dayjs from "dayjs"
import { db } from "../database/database.connection.js"

export async function getAlugueis(req, res){
    res.send("getAlugueis")
}

export async function inserirAlugueis(req, res){

    const {custumerId, gameId, daysRented} = req.body

    const customers = await db.query(`SELECT * FROM customers WHERE id=$1`, [custumerId])
    if(!customers.rows.length) return res.status(400).send("O Cliente informado não existe")

    const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
    if (!game.rows.length) return res.status(400).send("O jogo informado não existe")

    const jogoDisponivel = await db.query(`SELECT COUNT(*) FROM rentals WHERE "gameId" =$1 AND "returnDate" IS NULL`, [gameId])
    if(jogoDisponivel.rows[0].count >= game.rows[0].stockTotal) return res.status(400).send("Não há jogos disponíveis para aluguel")

    if (!daysRented <= 0) return res.status(400).send("O número de dias deve ser inteiro e maior que 0")

    
        const rentDate = dayjs(Date.now()).format('YYYY-MM-DD')
        const originalPrice = daysRented * game.rows[0].pricePerDay

         await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [custumerId, gameId, rentDate, daysRented, null, originalPrice, null])
            return res.sendStatus(201)
}

export async function finalizarAlugueis(req, res){
    res.send("finalizarAlugueis")
}

export async function apagarAlugueis(req, res){
    res.send("apagarAlugueis")
}