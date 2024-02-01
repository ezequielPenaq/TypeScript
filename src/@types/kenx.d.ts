import {knex} from "knex"

declare module 'knex/types/tables'{
    export interface  Tables {
        transactions:{
            id: string
            title: string
            amount: number
            creted_at: string
            session_id?: string
        }
    }
}
app.register(Cookie, {
    secret: 'your-secret-key', // substitua com a sua chave secreta
  });
  