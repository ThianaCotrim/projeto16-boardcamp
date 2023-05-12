import { db } from "../database/database.connection.js"

export async function getClientes(req, res){

    try{
        const clientes = await db.query(`SELECT * FROM customers`)

        for (let i = 0; i < clientes.rows.length; i++){
            const data = new Date (clientes.rows[i].birthday)
            const dataFormatada = data.toISOString().substring(0,10)
            clientes.rows[i].birthday = dataFormatada
        }
        res.send(clientes.rows)
    } catch(err){
        res.send(err.message)
    }
}

export async function getClientesById(req, res){
    const {id} = req.params

    try{
        const users = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])

        if(users.rows.length === 0) return res.status(404).send("Esse id não existe")

        const data = new Date (users.rows[0].birthday)
        const dataFormatada = data.toISOString().substring(0,10)
        users.rows[0].birthday = dataFormatada
        

        return res.send(users.rows[0])

    } catch(err){
        res.status(500).send(err.message);
    }
}

export async function inserirClientes(req, res){
    const {name, phone, cpf, birthday} = req.body

    if (name === '') return res.status(400).send("O nome do cliente não pode estar vazio")

    if (!/^\d{11}$/.test(cpf)) return res.status(400).send("O cpf deve conter 11 caracteres")

    if (!/^\d{10,11}$/.test(phone)) return res.status(400).send("O phone deve ter entre 10 e 11 caracteres")

    const cpfExistente = await db.query (`SELECT * FROM customers WHERE cpf = $1;`, [cpf])
    if (cpfExistente.rows.length) return res.status(409).send("CPF já existente, escolha outro cpf")

    try{
        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4);`,
        [name, phone, cpf, birthday])
        return res.sendStatus(201)

    } catch (err){
        res.status(400).send(err.message);
    }
}

export async function editClientesById(req, res){
    const {id} = req.params
    const {name, phone, cpf, birthday} = req.body

    if (!/^\d{11}$/.test(cpf)) return res.status(400).send("O cpf deve conter 11 caracteres")

    if (!/^\d{10,11}$/.test(phone)) return res.status(400).send("O phone deve ter entre 10 e 11 caracteres")

    if (name === '') return res.status(400).send("O nome do cliente não pode estar vazio")

    const cpfExistente = await db.query (`SELECT * FROM customers WHERE cpf = $1 AND id != $2;`, [cpf, id])
    if (cpfExistente.rows.length) return res.status(409).send("CPF já existente, escolha outro cpf")

    try{
        await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])

        await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,
         [name, phone, cpf, birthday, id])
        return res.status(200).send("Cliente atualizado com sucesso")
    } catch (err){
        res.status(400).send("Erro ao atualizar cliente")
    }
}