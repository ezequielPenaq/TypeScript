

import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { knex } from '../database'
import coockie from '@fastify/cookie'
import { checkSessionIdExists } from '../middlewares/check-sessions-id-exist'

// TIPOS DE TESTES. Unitários: quando testamos apenas uma unidade da nossa aplicação
//Integração: quando testamos uma ou mais unidades da nossa aplicação
//e2e (ponta a ponta): quando simulamos um usuario usando nossa aplicação

// piramide de teste: e2e( end to end) - não depende de tecnologia , não depende de arquiteturas;



export async function  transactionsRoutes(app: FastifyInstance){

    app.addHook('preHandler',async (request,response) => {
        console.log(`[${request.method}]${request.url}`)
    })

    app.get('/',{
        preHandler:[checkSessionIdExists],
    } ,
    
        async (request,response) => {
        const {sessionId} =request.cookies

        const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()
        return{ 
            transactions
        }
        
    })

    app.get('/:id',{
        preHandler:[checkSessionIdExists],
    } ,async (request) => {
        const {sessionId} =request.cookies
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
        })
            const {id}=getTransactionParamsSchema.parse(request.params)
            const transaction = await knex('transactions')
            .where('id',id)
            .first()
            .andWhere('session_id', sessionId)
            return {transaction}
    })

    app.get('/summary', {preHandler:[checkSessionIdExists],},async (request) => {
        const {sessionId} =request.cookies
        const summary= await knex('transactions')
        .where('session_id',sessionId)
        .sum('amount',{as:'amount'})
        .first()

        return{summary}
        
    })

    
    app.post('/',async (request,response) => {
        
        const createTransactionsBodySchema=z.object({
            title: z.string(),
            amount: z.number(),
            type:z.enum(['credito', 'debito'])
        })
             const {title,amount,type} = createTransactionsBodySchema.parse(request.body)  


            let sessionId= request.cookies.sessionId

            if(!sessionId){
                sessionId= randomUUID()

                response.cookie('sessionId',sessionId,{ 
                    path:'/',
                    maxAge:60*60*24*7,
                })
               
            }
            
             await knex('transactions') .insert({
                id: crypto.randomUUID(),
                title,
                amount: type === 'credito' ? amount : amount * -1,
                session_id:sessionId

            })
        return response.status(201).send()
        })
        
}