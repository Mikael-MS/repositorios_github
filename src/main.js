


class App {
    constructor(){
        // Lista de repositorios
        this.repositorios = [];

        //Form
        this.formulario = document.getElementById('form');

        //lista
        this.lista = document.querySelector('.list-group');

        // Método registrar os eventos do formulario
        this.registrarEventos()
    }

    registrarEventos(){
        this.formulario.onsubmit = evento => this.adicionarRepositorio(evento);
    }


    async adicionarRepositorio(evento){
        //evita a pagina recarregar ao submit do formulario
        evento.preventDefault();
        

        //recuperar valor do input
        let input = document.getElementById('repositorio').value;

        //Verifivar o input se for vazio
        if(!input){
            return;
        }

        try{ 
            //api
            let response = await axios.get(`https://api.github.com/repos/${input}`)
            console.log(response)

            // destroctor do objeto respose data
            let {name, description, html_url, owner: {avatar_url}} = response.data

            //Adiciona o repositorio na lista
            this.repositorios.push({
                nome: name,
                descricao: description,
                avatar_url: avatar_url,
                link: html_url
            
            });

            //renderizar aplicação
            this.renderizarTela()
        }catch(e){

            //Limpar erro ja existente
            let error = this.lista.querySelector('.list-group-item-danger');
            if(error !== null){
                this.lista.removeChild(error)
            }

            //lista
            let liError = document.createElement('li');
            liError.setAttribute('class', 'list-group-item list-group-item-danger');
            let txtError = document.createTextNode(`O repositório ${input} não existe`);
            liError.appendChild(txtError);
            this.lista.appendChild(liError);
        }  
    }

    renderizarTela(){
        // Limpar conteudo da lista
        this.lista.innerHTML = '';

        //Percorrer toda a lista e repositorios e criar os elementos
        this.repositorios.forEach(repositorio => {

            //lista
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-action');


            //img
            let img = document.createElement('img'); 
            img.setAttribute('src', repositorio.avatar_url);
            li.appendChild(img)

            //strong
            let strong = document.createElement('strong');
            let txtNome = document.createTextNode(repositorio.nome);
            strong.appendChild(txtNome);
            li.appendChild(strong);

            //Paragrafo
            let p = document.createElement('p');
            let txtDescricao = document.createTextNode(repositorio.descricao);
            p.appendChild(txtDescricao)
            li.appendChild(p)

            //link
            let a = document.createElement('a');
            a.setAttribute('target', '_blank');
            a.setAttribute('href', repositorio.link);
            let txtA = document.createTextNode('Acessar')
            a.appendChild(txtA);
            li.appendChild(a);

            // adicionar li na ul
            this.lista.appendChild(li);

            //limpar input 
            this.formulario.querySelector('input[id=repositorio]').value = '';

            //adicionar foco no input
            this.formulario.querySelector('input[id=repositorio]').focus();

        });

    }

    removeItem(repositorio){
        this.repositorios.slice(this.repositorios.indexOf(repositorio),1)

        this.renderizarTela()
    }

 
}

new App()