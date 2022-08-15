class Despesa {
	constructor(ano,mes,dia,tipo,descricao,valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}
	validarDados() {
      for(let i in this) {
      	if(this[i] == undefined || this[i] == '' || this[i] == null || this[i] < 0 ) {
      		return false
      	}
      }
      return true
	}
}

class Bd {
    
    constructor() {
    	let id = localStorage.getItem('id')
    	if(id === null) {
          localStorage.setItem('id',0)
    	} 
    }

    getProximoId() {
    	let proximoId = localStorage.getItem('id') 
        return parseInt(proximoId) + 1
    }

	gravar(d) {
    let id = this.getProximoId()
    
    localStorage.setItem(id,JSON.stringify(d))

    localStorage.setItem('id',id)
}
   recuperarTodosRegistros() {
   	  // ARRAY DE DESPESAS
   	  let despesas = Array()
      let id = localStorage.getItem('id')
      
      //recuperar todas as despesas cadastradas em LocalStorage
      for(let i=1;i <= id;i++) {
      	//recuperar despesa
      	let despesa = JSON.parse(localStorage.getItem(i))
      	// existe a possibilidade de haver indices que foram pulados ou removidos
      	// nesses casos nós vamos pular esses indices
      	if(despesa === null) {
      		continue
      	}
        despesa.id = i
      	despesas.push(despesa)
      }
      return despesas
   }

   pesquisar(despesa) {
   	let DespesasFiltradas = Array() 
    DespesasFiltradas = this.recuperarTodosRegistros()
    //console.log(DespesasFiltradas)

    //ano
    if(despesa.ano != ''){
    DespesasFiltradas = DespesasFiltradas.filter(d => d.ano == despesa.ano)
    }
    //mes
    if(despesa.mes != ''){
    DespesasFiltradas = DespesasFiltradas.filter(d => d.mes == despesa.mes)
    }
    //dia
    if(despesa.dia != ''){
    DespesasFiltradas = DespesasFiltradas.filter(d => d.dia == despesa.dia)
    }
    //tipo
    if(despesa.tipo != ''){
    DespesasFiltradas = DespesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }
    //descricao
    if(despesa.descricao != ''){
    DespesasFiltradas = DespesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }
    //valor
    if(despesa.valor != ''){
    DespesasFiltradas = DespesasFiltradas.filter(d => d.valor == despesa.valor)
    }
    return DespesasFiltradas
   }

   remover(id) {
     localStorage.removeItem(id)
   }
}

let bd = new Bd()

function CadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')


let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value,descricao.value, valor.value)

	if(despesa.validarDados()){ 
	bd.gravar(despesa)	
	// dialog de sucesso
	ModificaEstilo()
	LimparCamposFormulario()
	$('#modalRegistraDespesa').modal('show')
	} else {
	// dialog de erro
	ModificaEstilo2()
	console.log('a')
	$('#modalRegistraDespesa').modal('show')
}

}


function ModificaEstilo() {
	document.getElementById('TituloModal').innerHTML = "Sucesso na Gravação"
	document.getElementById('TituloModal').className = 'text-success'
	document.getElementById('descricaoModal').innerHTML = 'Despesa cadastrada com sucesso !'
	document.getElementById('botao').innerHTML = "Voltar"
	document.getElementById('botao').className = 'btn btn-success'
}

function ModificaEstilo2() {
	document.getElementById('TituloModal').innerHTML = "Erro na Gravação"
	document.getElementById('TituloModal').className = 'text-danger'
	document.getElementById('descricaoModal').innerHTML = 'Alguns dados não foram preenchidos.'
	document.getElementById('botao').innerHTML = "Voltar e Corrigir"
	document.getElementById('botao').className = 'btn btn-danger'
}

function ModificaEstilo3() {
    document.getElementById('TituloModal').innerHTML = "Sucesso na Remoção"
    document.getElementById('TituloModal').className = 'text-success'
    document.getElementById('descricaoModal').innerHTML = 'Os dados foram removidos com sucesso.'
    document.getElementById('botao').innerHTML = "Voltar"
    document.getElementById('botao').className = 'btn btn-success'
}

function LimparCamposFormulario() {
	document.getElementById('ano').value = ''
	document.getElementById('mes').value = ''
	document.getElementById('dia').value = ''
	document.getElementById('tipo').value = ''
	document.getElementById('descricao').value = ''
	document.getElementById('valor').value = ''
}

function carregaListaDespesas(despesas = Array(),filtro = false) {
	
	if(despesas.length == 0 && filtro == false) {
	despesas = bd.recuperarTodosRegistros()
    }

    // selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''
	/*
    <tr>
               0 = <td>12/03/2022</td>
               1 =  <td>Alimentação</td>
               2 = <td>parque</td>
               3 = <td>150.00</td>
    </tr>
*/
    let total = 0
    //percorrer o array despesas, listando cada despesa de forma dinâmica
	despesas.forEach(function(d) {
         
        total += Number(d.valor)
        //criando a linha(tr)
         let linha = listaDespesas.insertRow()

         // criar as colunas(td)
         linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

         // ajustar o tipo 
         switch(d.tipo) {
         	case '1': d.tipo = 'Alimentação'
         		break
         	case '2': d.tipo = 'Educação'
         	    break
         	case '3': d.tipo = 'Lazer'
         		break
         	case '4': d.tipo = 'Saúde'
         		break
         	case '5': d.tipo = 'Transporte'	
         		break
         }
         linha.insertCell(1).innerHTML = d.tipo

         linha.insertCell(2).innerHTML = d.descricao
         linha.insertCell(3).innerHTML = d.valor
         //criar o botão de exclusão
         let btn = document.createElement('button')
         btn.className = 'btn btn-danger'
         btn.innerHTML = '<i class="fas fa-times"></i>'
         btn.id = `id_despesa_${d.id}`
         btn.onclick = function() {
         	ModificaEstilo3()
            $('#modalConsulta').modal('show')
         	let id = this.id.replace('id_despesa_','')
         	bd.remover(id)
         }
         linha.insertCell(4).append(btn) 
         //console.log(d)
	})
    document.getElementById('total').innerHTML = `Valor Total de Despesas: ${total} R$`
}

function PesquisarDespesa() {
	let ano = document.getElementById('ano').value 
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value  
  
  let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)
  
  let despesasFiltradas = bd.pesquisar(despesa)
  carregaListaDespesas(despesasFiltradas,true)
}




