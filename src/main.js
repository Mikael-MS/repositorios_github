
class App {
    constructor(){
        // List de repositorios
        this.repositories = [];

        //Form
        this.form = document.getElementById('form');

        //lista
        this.list = document.querySelector('.list-group');

        // Método registrar os eventos do form
        this.registerEvent()
    }

    registerEvent(){
        this.form.onsubmit = event => this.addRepository(event);
    }


    async addRepository(event){
        //evita a pagina recarregar ao submit do form
        event.preventDefault();
        

        //recuperar valor do input
        let input = document.getElementById('repositorio').value;

        //Verifivar o input se for vazio
        if(!input){
            return;
        }

        try{ 
            //api
            let response = await axios.get(`https://api.github.com/repos/${input}`)
            

            // destroctor do objeto respose data
            let {name, description, html_url, owner: {avatar_url}} = response.data

            //Adiciona o repositorio na list
            this.repositories.push({
                nome: name,
                descricao: description,
                avatar_url: avatar_url,
                link: html_url
            
            });

            //renderizar aplicação
            this.renderScreen()
        }catch(e){

            //Limpar erro ja existente
            let error = this.list.querySelector('.list-group-item-danger');
            if(error !== null){
                this.list.removeChild(error)
            }

            //list
            let liError = document.createElement('li');
            liError.setAttribute('class', 'list-group-item list-group-item-danger');
            let txtError = document.createTextNode(`O repositório ${input} não existe`);
            liError.appendChild(txtError);
            this.list.appendChild(liError);
        }  
    }

    renderScreen(){
        // Limpar conteudo da list
        this.list.innerHTML = '';

        //Percorrer toda a list e repositorios e criar os elementos
        this.repositories.forEach((repository,index ) => {

            //list
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-action');

            //img
            let img = document.createElement('img'); 
            img.setAttribute('src', repository.avatar_url);
            li.appendChild(img)

            //strong
            let strong = document.createElement('strong');
            let txtName = document.createTextNode(repository.nome);
            strong.appendChild(txtName);
            li.appendChild(strong);

            //Paragrafo
            let p = document.createElement('p');

            if(!repository.descricao){
                p.innerHTML = ''
            }else{
                let txtDescricao = document.createTextNode(repository.descricao);
                p.appendChild(txtDescricao)
                li.appendChild(p)
            }
            
            //link
            let a = document.createElement('a');
            a.setAttribute('target', '_blank');
            a.setAttribute('href', repository.link);
            let txtA = document.createTextNode('Acessar')
            a.appendChild(txtA);
            li.appendChild(a);

           
            const removeBtn = document.createElement("button")
            removeBtn.setAttribute('class', 'btn btn-danger')
            removeBtn.innerHTML = 'Remover'
            removeBtn.onclick = () => this.removeItem(index)
            li.appendChild(removeBtn)

            
            // adicionar li na ul
            this.list.appendChild(li);
            
            //limpar input 
            this.form.querySelector('input[id=repositorio]').value = '';

            //adicionar foco no input
            this.form.querySelector('input[id=repositorio]').focus();

        });

    }

    removeItem(index) {
        this.repositories = this.repositories.filter((item, i) => i != index)
        this.renderScreen()
    }
 
}

new App()