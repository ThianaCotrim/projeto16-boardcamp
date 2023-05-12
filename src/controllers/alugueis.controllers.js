import dayjs from "dayjs"
import { db } from "../database/database.connection.js"

export async function getAlugueis(req, res){
    const games = await db.query(`SELECT * FROM games`)
    const customers = await db.query(`SELECT * FROM customers`)

    try {

        const rentals = await db.query(`SELECT rentals.* FROM rentals;`)

        const rentalRes = rentals.rows.map(r => {
            const cust = customers.rows.find(cust => cust.id === r.customerId)
            const game = games.rows.find(game => game.id === r.gameId)

            return {
                ...r, 
                customer: {
                    id: cust.id,
                    name: cust.name
                },
                game: {
                    id: game.id,
                    name: game.name
                }
            }
        })
        return res.send(rentalRes)
    } catch (err){
        return res.status(500).send(err.message)
    }
}

export async function inserirAlugueis(req, res){

    const {customerId, gameId, daysRented} = req.body

        const customers = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId])
        if(!customers.rows.length) return res.status(400).send("O Cliente informado não existe")

        const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
        if (!game.rows.length) return res.status(400).send("O jogo informado não existe")

        const jogoDisponivel = await db.query(`SELECT COUNT(*) FROM rentals WHERE "gameId" =$1 AND "returnDate" IS NULL`, [gameId])
        if(jogoDisponivel.rows[0].count >= game.rows[0].stockTotal) return res.status(400).send("Não há jogos disponíveis para aluguel")

        if (daysRented <= 0) return res.status(400).send("O número de dias deve ser inteiro e maior que 0")

        const rentDate = dayjs(Date.now()).format('YYYY-MM-DD')
        const originalPrice = daysRented * game.rows[0].pricePerDay

         await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, null, originalPrice, null])
            return res.sendStatus(201)
}

export async function finalizarAlugueis(req, res){
    res.send("finalizarAlugueis")
}

export async function apagarAlugueis(req, res){
    const {id} = req.params

    const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])

    if(rental.rows.length === 0) return res.status(404).send("Aluguel não encontrado")
    if(rental.rows[0].returnDate === null) return res.status(400).send("Aluguel já foi finalizado") 
  
    await db.query(`DELETE FROM rentals WHERE id=$1`, [id])
    return res.status(200).send("Aluguel excluído com sucesso")
        
}