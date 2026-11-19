const form = document.querySelector('#pokeform')
const feedback = document.querySelector('#feedback')
const listaCards = document.querySelector('#lista-cards')

const pokemonsCadastrados =[]

console.log('script')

const API = 'http://localhost:3000/pokemons'

async function carregarDoBanco() {
    try {
        const resposta = await fetch(API)
        const lista = await resposta.json()
        pokemonsCadastrados.length = 0
        lista.forEach(p => pokemonsCadastrados.push({
            id: p.id,
            nome: p.nome,
            imagem: p.imagem,
            tipo: p.tipo ? p.tipo.split(',') : [],
            cp: p.cp,
            treinador: p.treinador
        }))
        rederizarArena()
    } catch (erro) {
        feedback.textContent = '❌ Não foi possível carregar o baralho.'
        console.log(erro)
    }
}
carregarDoBanco()

const URL_POKEAPI = 'https://pokeapi.co/api/v2/pokemon'

async function buscarDadosPokemon(nome) {


    const nomeFormatado = nome.toLowerCase().trim()

    try {
        const resposta = await fetch(`${URL_POKEAPI}/${nomeFormatado}`)

        if (!resposta.ok) {
            throw new Error('Pokemon não encontrado na PokeAPI')
        }
        feedback.textContent = ""
        feedback.style.color = 'red'
        const dados = await resposta.json();
        return dados
    }
    catch (error) {
        feedback.textContent = "❌ Pokemon não encontrado na PokeAPI."
        feedback.style.color = 'red'
        console.log(" Não foi possivel carregar os dados do pokemon solicitado na PokeAPI", error)
        return [];
    }

}

function extrairImagemPokemon(dadosPokemon) {
    if (!dadosPokemon) {
        console.log("Dados Vazios")
        return null
    }

    const artWorkOfficial = dadosPokemon.sprites?.other?.['official-artwork']?.front_default
    const spriteDefault = dadosPokemon.sprites?.front_default
    return artWorkOfficial || spriteDefault || null
}

function extrairTipoPokemon(dadosPokemon) {
    if (!dadosPokemon || !dadosPokemon.types) {
        console.log("Dados vazios")
        return null
    }

    const tipos = dadosPokemon.types.map(function (item) {
        return item.type.name
    })
    return tipos
}

function extrairCombatPower(dadosPokemon) {
    if (!dadosPokemon || !dadosPokemon.base_experience) {
        console.log("Dados vazios")
        return null
    }
    return xp = dadosPokemon.base_experience
}

function verificaAntes(id)
{
    console.log("verificando...", id)
    const listaCards = document.querySelectorAll('.card-pokemon')
    let existe = false    
    // Array.from(listaCards).some(card=>{
    //            return card.id == id})
    listaCards.forEach((card) => {
        if(card.id == id)
        {
           existe =  true
        } 
  });
   return existe
    
}

// nome,imagem, tipo, xp , treinador = "none"
function criarCardPokemon(id, nome, imagem, tipo, combatPower, treinador, campeao = false) {
    const card = document.createElement('div')
    card.className = 'card-pokemon'
    card.setAttribute('id',id)
    const img = document.createElement('img')
    img.className = 'card-pokemon-img'
    img.src = imagem || 'https://placehold.co/96x96?text=?'
    img.alt = nome

    const nomeCard = document.createElement('h3')
    nomeCard.className = 'card-pokemon-nome'
    nomeCard.textContent = campeao?`👑 ${nome}`:nome;

    const infoTipo = document.createElement('p')

    //Exercicio 1   
    infoTipo.className = 'card-pokemon-info'
    infoTipo.textContent = `Tipo: ${tipo || 'desconhecido'}`
    //Exercicio 1
    infoTipo.textContent = infoTipo.textContent.replace(",", ", ")

    const cp = document.createElement('p')
    cp.className = 'card-pokemon-info'
    cp.textContent = `CP: ${combatPower || '000'}`

    //exercicio 1 
    treinador = treinador != null ? treinador : "Sem Treinador"
    const treinadorName = document.createElement('p')
    treinadorName.className = 'card-pokemon-info'
    treinadorName.textContent = `Treinador: ${treinador}`

     // exercicio 3c- Botão para apagar o card
    const btnRemover = document.createElement('button')
    btnRemover.type='button'
    btnRemover.className ='btn-remover'
    btnRemover.textContent ='x'
    btnRemover.title = 'remover'
    btnRemover.setAttribute('aria-label',`Remover${nome}`)
    btnRemover.dataset.nome = nome 
    card.append(btnRemover, img,nomeCard,infoTipo,cp,treinadorName)
    
    //exercicio 2
    aplicarEstiloPorTipo(card, tipo)
    if(campeao) card.classList.add('campeao')
    listaCards.appendChild(card)

    console.log(card, img, nomeCard)
}

 // exercicio 3c- Botão para apagar o card
// listaCards.addEventListener('click', function(event){
//     const botao = event.target.closest('.btn-remover')
//     if(!botao) return
//     botao.closest('.card-pokemon').remove()
// })

listaCards.addEventListener('click', async function (event) {
    const botao = event.target.closest('.btn-remover')
    if (!botao) return
    const card = botao.closest('.card-pokemon')

    const resposta = await fetch(`${API}/${card.id}`, { method: 'DELETE' })
    if (!resposta.ok) return

    const i = pokemonsCadastrados.findIndex(p => p.id == card.id)
    if (i !== -1) pokemonsCadastrados.splice(i, 1)
    rederizarArena()
})



function aplicarEstiloPorTipo(card, tipo) {
    const estiloCard = [
        { tipo: 'fire', borda: '#e25822', fundo: '#ffe3d6' },
        { tipo: 'water', borda: '#2980d9', fundo: '#dcecff' },
        { tipo: 'grass', borda: '#3a9d3a', fundo: '#e0f6dc' },
        { tipo: 'electric', borda: '#d4a800', fundo: '#fff7c2' },
        { tipo: 'poison', borda: '#8e44ad', fundo: '#eddcf5' },
        { tipo: 'normal', borda: '#7f8c8d', fundo: '#ececec' },
        { tipo: 'ice', borda: '#3dbdc2', fundo: '#e0f9fb' },
        { tipo: 'fighting', borda: '#c0392b', fundo: '#fcdcd8' },
        { tipo: 'ground', borda: '#cc8830', fundo: '#f8e9d4' },
        { tipo: 'flying', borda: '#70a8da', fundo: '#e6f2ff' },
        { tipo: 'psychic', borda: '#e84393', fundo: '#fde4f0' },
        { tipo: 'bug', borda: '#83a123', fundo: '#f0f6d6' },
        { tipo: 'rock', borda: '#a38c21', fundo: '#f4f0db' },
        { tipo: 'ghost', borda: '#6c5ce7', fundo: '#e8e5fa' },
        { tipo: 'dragon', borda: '#4834d4', fundo: '#e1dffd' },
        { tipo: 'steel', borda: '#8a99a6', fundo: '#e3e8ec' },
        { tipo: 'fairy', borda: '#e056fd', fundo: '#fbe2ff' },
        { tipo: 'dark', borda: '#2d3436', fundo: '#dcdde1' },
        

    ]

    console.log(tipo.length)
    let tipo1 = tipo.length > 0 ? tipo[0] : tipo
    let tipo2 = tipo.length > 0 ? tipo[1] : null
    let cor_1 = null
    let cor_2 = null
    console.log(tipo1, tipo2)
    //Matheus W
    for (let i = 0; i < estiloCard.length; i++) {
        if (tipo1 == estiloCard[i].tipo) {
            cor_1 = i
        }
        else if (tipo2 == estiloCard[i].tipo) {
            cor_2 = i
        }
    }


        console.log(cor_1, cor_2)

        if (cor_2 != null) {
            card.style.background = `linear-gradient(135deg, ${estiloCard[cor_1].borda} 50%, ${estiloCard[cor_2].borda} 50%)`

        }
        else {
            card.style.backgroundColor = estiloCard[cor_1].borda
            card.style.borderColor = estiloCard[cor_1].fundo
        }
    }

    form.addEventListener('submit',
        async function (event) {
            event.preventDefault(); //impedindo de recarregar a pagina
            const nome = document.querySelector('#nome').value.trim();
            const tipo = document.querySelector('#tipo').value.trim();
            const cp = Number(document.querySelector('#cp').value.trim());
            const treinador = document.querySelector('#treinador').value.trim();
        
            if (nome.length < 3) {
                console.log("O campo precisa ter mais de 3 caracteres.")

                feedback.textContent = "❌ Nome deve conter ao menos 3 caracteres."
                feedback.style.color = 'red'
                return;
            }

            else if (cp < 100) {
                feedback.textContent = "❌ O poder do pokemon precisa ser maior que 100."
                feedback.style.color = 'red'
                return;
            }
            else {
                const dadosApi = await buscarDadosPokemon(nome)
                if (!dadosApi) {
                    feedback.textContent = "❌ O pokemon não foi encontrado."
                    feedback.style.color = 'red'
                    return
                }

                const imagemURL = extrairImagemPokemon(dadosApi)
                const tipoPokemon = extrairTipoPokemon(dadosApi)
                const combatPower = extrairCombatPower(dadosApi)
                const id = dadosApi.id
                if(verificaAntes(id))
                    {  
                        feedback.textContent = "❌ Esse pokemon já está na arena."
                        feedback.style.color = 'red'
                        console.log("Ja existe", verificaAntes(id))
                        return
                    }

                //criarCardPokemon(id, nome, imagemURL, tipoPokemon, combatPower, treinador); depreciada 28/10
                // pokemonsCadastrados.push({id, nome, imagem:imagemURL,tipo:tipoPokemon,cp:combatPower, treinador})   
                const novo = { id, nome, imagem: imagemURL, tipo: tipoPokemon, cp: combatPower, treinador }

                    const resposta = await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novo)
                })

                if (!resposta.ok) {
                    const erro = await resposta.json()
                    feedback.textContent = `❌ ${erro.erro}`
                    feedback.style.color = 'red'
                    return
                }

                pokemonsCadastrados.push(novo)


                rederizarArena() // função nova
                feedback.textContent = "✅ Pokemon cadastrado com sucesso."
                feedback.style.color = 'green'
                
            }



        }
    )


    function rederizarArena()
    {
        listaCards.innerHTML=""
        const ordenados = [...pokemonsCadastrados].sort((a,b)=>(b.cp || 0) -(a.cp ||0))
        ordenados.forEach((p,i)=>criarCardPokemon(p.id, p.nome, p.imagem,p.tipo, p.cp,p.treinador, i===0))
    }


    function limparCampos() {
        document.querySelector('#nome').value = '';
        document.querySelector('#tipo').value = '';
        document.querySelector('#cp').value = '';
        document.querySelector('#treinador').value = '';
    }

    const nome = document.querySelector('#nome')
    let debounceBusca = null
    let requisicaoAtual = 0;
    // ela tambem deve criar o autocomplete
    nome.addEventListener('input',
        function () {
            const valor = nome.value.trim();

            clearTimeout(debounceBusca)
            requisicaoAtual++


            if (valor.length < 3) {

                feedback.textContent = "❌ Nome deve conter ao menos 3 caracteres."
                feedback.style.color = 'red'
            }
            else {

                feedback.textContent = ""
                const idRequisicao = requisicaoAtual

                debounceBusca = setTimeout(
                    async function () {
                        console.log(nome.value);
                        const dadosApi = await buscarDadosPokemon(nome.value)
                        if (idRequisicao != requisicaoAtual) {
                            return;
                        }

                        if (!dadosApi) {
                            return;
                        }

                        const nomePokemon = dadosApi.name!=undefined ? dadosApi.name : ''; //
                        const imagemURL = extrairImagemPokemon(dadosApi)
                        const tipoPokemon = extrairTipoPokemon(dadosApi)
                        const combatPower = extrairCombatPower(dadosApi)

                        const nomeValue = document.querySelector('#nome')
                        const tipoValue = document.querySelector('#tipo')
                        const cpValue = document.querySelector('#cp')
                        console.log(nomeValue)

                        nomeValue.value = nomePokemon
                        tipoValue.value = tipoPokemon
                        cpValue.value = combatPower
                        

                    }, 1000)
            }
        }
    );