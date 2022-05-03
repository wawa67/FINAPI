const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express()

app.use(express.json())

function verifyIfCustomerExistCPF(request, response, next){
    const { cpf } = request.headers

    const customer = customers.find((customer) => customer.cpf === cpf)

    if(!customer){
        return response.status(400).json({error:"Customer not found"})
    }

    request.customer = customer

    return next();
}
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

app.get("/statement",verifyIfCustomerExistCPF, (request, response)=>{
    const {customer} = request;

    return response.json(customer.statement);
})

app.post("/deposit", verifyIfCustomerExistCPF, (request,response)=>{
    const {amount, description} = request.body
    const { customer } = request

    const statementOperation = {
        amount,
        description,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)

    return response.json({message:"deposit sucessfull"})
})
app.listen(3333);