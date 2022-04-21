const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express()

app.use(express.json())

const customers = []

app.post("/account", (request, response)=>{
    const {cpf, name} = request.body;
    const id = uuidv4();

    const customerAlreadyExist = customers.some((customer) => customer.cpf === cpf)

    if(customerAlreadyExist){
        return response.status(400).json({error:"customer already exist"});
    }

    customers.push({
        id,
        name,
        cpf,
        statement: []
    })

    return response.status(201).json(customers);
})

app.listen(3333);