/* Require significa que eu  preciso de um módulo que vem de fora. 
   esse módulo se chama CommoJs*/

const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao App de metas"

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8") //está lendo o arq. de metas.json
        metas = JSON.parse(dados) // 
    } catch (error) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2)) //Escrever para o artigo json
}

// Função assíncrona
const cadastrarMeta = async () => {
    const meta = await input({message: 'Digite a meta: '})

    if (meta.length == 0) {
        mensagem = 'A meta não pode ser vazia'
        return
    }

    // Coloca uma meta no array de metas
     metas.push(
        {value: meta, checked:false}
    )

    mensagem = "Meta(s) cadastrada(s) com sucesso!"
}

const listarMetas = async () => {
    //Função caso não haja nenhuma meta cadastrada
    if (metas.length == 0) {
        mensagem = "Não existem metas cadastradas!"
        return
    }
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar, e o Enter para finalizar essa etapa.", 
        choices: [...metas], // Joga todas as metas (cópia delas) aqui nesse novo array 
        instructions: false,
    })

    

     //Desmarcar metas
     metas.forEach((m => {
        m.checked = false
    }))


    //Caso não haja nenhuma meta selecionada
    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    //Procurar se a resposta é igual a da meta e marcar verdadeiro se caso for
    respostas.forEach((reposta) => {   //resposta objeto de respostas / m objeto de metas
        const meta = metas.find((m) => { //Procurar as metas 
            return m.value == reposta
        })
        meta.checked = true
    })
    mensagem = "meta(s) marcada(s) como concluída(s)"
}

//Função para as metas realizadas
const metasRealizadas = async () => {

    //Função caso não haja nenhuma meta cadastrada
    if (metas.length == 0) {
        mensagem = "Não existem metas cadastradas!"
        return
    }
    const realizadas = metas.filter((meta) => {
        return meta.checked == true; 
    })

    //Caso não haja nenhuma meta realizada
    if (realizadas.length == 0) {
        mensagem = "Não existem metas realizadas! :("
        return
    }

    await select({
        message: "Metas realizadas: " + realizadas.length, 
        choices: [...realizadas]
    })
}

//Função para as metas abertas
const metasAbertas = async () => {

    //Função caso não haja nenhuma meta cadastrada
    if (metas.length == 0) {
        mensagem = "Não existem metas cadastradas!"
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    //Caso não haja nenhuma meta aberta
    if (abertas.length == 0) {
        mensagem = "Não existem metas abertas! :)"
    }


    await select({
        message: "Metas abertas: " + abertas.length, 
        choices: [...abertas]
    })
}

//Função para deletar metas
const deletarMetas = async () => {

    //Função caso não haja nenhuma meta cadastrada
    if (metas.length == 0) {
        mensagem = "Não existem metas cadastradas!"
        return
    }
    const metasDesmarcadas = metas.map((meta) => { //Map: Pega o array e modifica-o. Está pegando o array original e desmarcando-o.
        return {value: meta.value, checked: false}
    })

    const itensADeletar = await checkbox({
        message: "Selecione a meta a deletar", 
        choices: [...metasDesmarcadas], // Joga todas as metas (cópia delas) aqui nesse novo array 
        instructions: false,
    })

    //Caso não haja nenhuma meta para ser deletada
    if (itensADeletar.length == 0) {
        mensagem = "Não existem itens para serem deletadas! "
        return
    }

    //Guarda a meta diferente do item que será excluída
    itensADeletar.forEach(item => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    mensagem = "Meta(s) deletada(s) com sucesso! "
}

const mostrarMensagem = () => {
    console.clear();

    if (mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

//Função de start do programa (assíncrona)
const start = async () => {
   await carregarMetas()

    while (true) {
        mostrarMensagem()
        await salvarMetas()

    const opcao = await select({ //Pede para o comput. esperar o usuário selecionar uma opção
        message: "Menu >", 

        choices: [
            {
                name: "Cadastrar meta", 
                value: "cadastrar"
            }, 

            {
                name: "Listar metas", 
                value: "listar"
            },

            {
                name: "Metas realizadas", 
                value: "realizadas"
            },

            {
                name: "Metas abertas", 
                value: "abertas"
            },

            {
                name: "Deletar metas", 
                value: "deletar"
            },

            {
                name: "Sair", 
                value: "sair"
            }
        ], 
        instructions: false,
    }) 

    
    

        switch (opcao) {
            case "cadastrar":
               await cadastrarMeta()
                break;
            case "listar":
                await listarMetas()
                break;
            case "realizadas": 
                await metasRealizadas()
                break
            case "abertas": 
                await metasAbertas()
                break
            case "deletar": 
                await deletarMetas()
                break
            case "sair":
                console.log("Até a próxima!")
                return;
        }
    }
}

//Executando a função
start()
