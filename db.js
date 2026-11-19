// require('dotenv').config({quiet:true})

// const DATABASE_URL = process.env.DATABASE_URL
// const host = new URL(DATABASE_URL).host
// const neonHttpEndPoint = `https://${host}/sql`

// const LIMITE_BARALHO = 12 //CARTAS
// async function executarQueryNeon(querySQL, parametros=[]) {
//     try {
//         const resposta = await fetch(neonHttpEndPoint, {
//             method: 'POST',
//             headers:{
//                 'Neon-Connection-String':DATABASE_URL,
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify({
//                 query:querySQL,
//                 params:parametros
//             })
//         })
//         if(!resposta.ok){
//             const erroTexto = await resposta.text()
//             throw new Error(`Erro HTTP ${resposta.status}:${erroTexto}`)
//         }
//         const dados = await resposta.json()
//         return dados.rows
//     }
//     catch(erro){
//         console.log('Falha ao comunicar com o banco de dados', erro)
//         return null
//     }
// }
require('dotenv').config({ quiet: true })

const DATABASE_URL = process.env.DATABASE_URL
const host = new URL(DATABASE_URL).host
const neonHttpEndPoint = `https://${host}/sql`

const LIMITE_BARALHO = 12 // cartas

async function executarQueryNeon(querySQL, parametros = []) {
    try {
        const resposta = await fetch(neonHttpEndPoint, { // <- vírgula que faltava
            method: 'POST',
            headers: {
                'Neon-Connection-String': DATABASE_URL,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: querySQL,
                params: parametros
            })
        })
        if (!resposta.ok) {
            const erroTexto = await resposta.text()
            throw new Error(`Erro HTTP ${resposta.status}: ${erroTexto}`)
        }
        const dados = await resposta.json()
        return dados.rows
    } catch (erro) {
        console.log('Falha ao comunicar com o banco de dados', erro)
        return null
    }
}

module.exports = { executarQueryNeon, LIMITE_BARALHO }