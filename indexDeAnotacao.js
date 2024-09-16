// Tipos de dados, escopos e variáveis
const mensagem = "olá, mundo!";


{
    const mensagem = "olá eu!"
    console.log(mensagem)
}

console.log(mensagem)


//Array e objetos

let metas = ["Daniel", "Alô"]

console.log(metas[1] + " " + metas[0])


let meta = {
    value: "Ler um livro por mês",
    checked: false,
    log: (info) => {
        console.log(info)
    }
    
}
meta.value = "Agora são dois livros por mês"
meta.log(meta.value)

/*function = está fora de um objeto
 método = está dentro de um objeto*/

 //arrow function 
 const criarMeta = () => {}
 //named function
 function criarMeta () {}
