// const http = require('http')
// const fs = require('fs')
// const path = require('path')

// const {
//     LIMITE_BARALHO, 
//     listar_baralho, 
//     contarBaralho,
//     salarPokemon
// } = require('./script_db.js')


// const PORTA = process.env.PORT || 3002

// const arquivos = {
//     '/':{arquivo: 'index.html', tipo = 'text/html; charset=utf-8'},
//     '/index.html':{arquivo:'index.html', tipo:'text/html; charset=utf-8'},
//     '/style.css':{arquivo:'style.css', tipo:'text/css; charset=utf-8'},
//     '/script.js':{arquivo:'script.js', tipo:'text/javascript; charset=utf-8'}

// }

// function responderJSON(res, status, dados){
//     res.writeHead(status, {'Content-Type':'application/json; charset=utf-8'})
//     res.end(JSON.stringify(dados))
// }

// function lerCorpo(req) {
//     return new Promise((resolve,reject)=>{
//         let corpo =''
//         req.on('data',pedaco => corpo+=pedaco)
//         req.on('end',()=>{
//             try{resolve(JSON.parse(corpo || '{}'))}
//             catch(erro){reject(erro)}
//         })
//     })
// }


// const servidor = http.createServer(async (req,res) => {
//     //GET   /api/pokemon    -> listar os pokemons salvos
//     if(req.url==='api/pokemon' && req.method ==='GET'){
//         const linhas = await listar_baralho()
//         if(linhas === null) return responderJSON(res,500,{erro:'Falha ao consultar oo banco de dados'})
//         return responderJSON(res, 200, linhas)    
//     }

//     // arquivos da pagina
//     const rota = arquivos[req.url]
//     if (rota) {
//         req.writeHead(200, {'Content-Type':rota.tipo})
//         return fs.createReadStream(path.join(__dirname, rota.arquivo)).pipe(res)
//     }
//     res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'})
//     res.end('Página não encontrada')

//     //temporario
//     servidor.listen(PORTA, () => {
//         console.log(`Arena Pokemon em https://localhost:${PORTA}`)
//     })
// })
const express = require('express')
const cors = require('cors')
const { executarQueryNeon, LIMITE_BARALHO } = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// Lista todos
app.get('/pokemons', async (req, res) => {
    const rows = await executarQueryNeon('SELECT * FROM pokemons ORDER BY cp DESC')
    if (rows === null) return res.status(500).json({ erro: 'Erro no banco de dados' })
    res.json(rows)
})

// Cadastra
app.post('/pokemons', async (req, res) => {
    const { id, nome, imagem, tipo, cp, treinador } = req.body

    if (!id || !nome || nome.length < 3) {
        return res.status(400).json({ erro: 'Dados inválidos' })
    }

    const contagem = await executarQueryNeon('SELECT COUNT(*)::int AS total FROM pokemons')
    if (contagem === null) return res.status(500).json({ erro: 'Erro no banco de dados' })
    if (contagem[0].total >= LIMITE_BARALHO) {
        return res.status(400).json({ erro: `O baralho já tem ${LIMITE_BARALHO} cartas` })
    }

    const rows = await executarQueryNeon(
        `INSERT INTO pokemons (id, nome, imagem, tipo, cp, treinador)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING
         RETURNING id`,
        [id, nome, imagem, Array.isArray(tipo) ? tipo.join(',') : tipo, cp, treinador || null]
    )
    if (rows === null) return res.status(500).json({ erro: 'Erro no banco de dados' })
    if (rows.length === 0) return res.status(409).json({ erro: 'Esse pokemon já está na arena' })

    res.status(201).json({ ok: true })
})

// Remove
app.delete('/pokemons/:id', async (req, res) => {
    const rows = await executarQueryNeon('DELETE FROM pokemons WHERE id = $1 RETURNING id', [req.params.id])
    if (rows === null) return res.status(500).json({ erro: 'Erro no banco de dados' })
    res.json({ ok: true })
})

app.listen(3000, () => console.log('API rodando em http://localhost:3000'))