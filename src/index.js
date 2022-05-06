const express = require('express');
const { type } = require('express/lib/response');
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
function getBalance(statement){
    const balance = statement.reduce((acc,operation)=>{
        if(operation.type === "credit"){
            return acc + operation.amount;
        }else{
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}
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

    return response.status(201).send()
})

app.post("/withdraw", verifyIfCustomerExistCPF, (request,response)=>{
    const {amount} = request.body;
    const {customer} = request

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return response.status(400).json({error:"Insufficient fouds!"});
    }

    const statementOperation = {
        amount,
        create_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
})

app.get("/statement/date", verifyIfCustomerExistCPF, (request,response)=>{
    const { date } = request.query
    const {customer} = request

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

    return response.json(statement);
})

app.put("/account", verifyIfCustomerExistCPF, (request,response)=>{
    const { name } = request.body
    const { customer } = request

    customer.name = name

    response.status(201).send()
})

app.get("/account",verifyIfCustomerExistCPF, (request, response)=>{
    const { customer } = request

    return response.json(customer);
})

app.listen(3333);