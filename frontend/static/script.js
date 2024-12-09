// Objeto que mapeia setores para suas respectivas funções
const funcoesPorSetor = {
    Operacao: [
      "Auxiliar Administrativo",
      "Técnico de Enfermagem Atendimento",
      "Técnico de Enfermagem Plantonista",
      "Enfermeiro Atendimento (Case)",
      "Enfermeiro Plantonista",
      "Enfermeiro Visitador",
      "Enfermeiro Gestor de Escala",
      "Enfermeiro Especialista",
      "Fisioterapeuta",
      "Nutricionista",
      "Fonoaudiologo",
      "Assistente Social",
      "Médico Visitador",
      "Médico Plantonista",
      "Médico Paliativista",
      "Motorista",
    ],
    Farmacia: [
      "Auxiliar Administrativo",
      "Auxiliar de Farmácia",
      "Gestor de Insumos",
      "Farmacêutico",
    ],
    Administrativo: [
      "Recepcionista",
      "Assistente Administrativo",
      "Assistente de Recursos Humanos",
      "Assistente de Compras",
      "Assistente de Contabilidade",
      "Analista de Recursos Humanos",
      "Analista de Contabilidade",
      "Analista de Compras",
      "Assistente de Departamento Pessoal",
      "Analista de Departamento Pessoal",
      "Contador",
    ],
    Auditoria: [
      "Enfermeiro Auditor Interno",
      "Enfermeiro Auditor Externo",
      "Médico Auditor Interno",
      "Médico Auditor Externo",
      "Assistente de Recurso de Glosa",
    ],
    Gestao: [
      "Gerente de Operações",
      "Gerente Administrativo",
      "Gerente de Auditoria",
      "Coordenador de Enfermagem",
      "Coordenador de Medicina",
      "Coordenador de Farmácia",
      "Coordenador de Recursos Humanos e Departamento Pessoal",
      "Coordenador Financeiro",
    ],
  };
/*
// Função para carregar a lista de usuários
async function carregarUsuarios() {
    try {
        const response = await fetch('http://localhost:5000/api/users');
        const usuarios = await response.json();
        const listaUsuarios = document.getElementById('usuarios-lista');

        if (usuarios.length === 0) {
            listaUsuarios.innerHTML = '<p>Nenhum usuário encontrado.</p>';
            return;
        }

        listaUsuarios.innerHTML = ''; // Limpa a lista antes de adicionar novos usuários
        usuarios.forEach(usuario => {
            const usuarioDiv = document.createElement('div');
            usuarioDiv.className = 'usuario-item';
            usuarioDiv.innerHTML = `<p>${usuario.nome} - ${usuario.funcao}</p>`;
            listaUsuarios.appendChild(usuarioDiv);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}
*/
// Função para cadastrar um novo usuário
async function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta os dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        endereco: document.getElementById('endereco').value,
        setor: document.getElementById('setor').value,
        funcao: document.getElementById('funcao').value,
        especialidade: document.getElementById('especialidade') ? document.getElementById('especialidade').value : '',
        registro_categoria: document.getElementById('registro') ? document.getElementById('registro').value : '',
    };

    try {
        // Faz a requisição para a API
        const response = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Exibe a mensagem de sucesso
            document.getElementById('userForm').reset(); // Limpa o formulário após o envio
            window.location.href = '/usuarios'; // Redireciona para a página de usuários
        } else {
            // Se a resposta não for ok, exibe uma mensagem de erro
            const errorData = await response.json();
            alert(`Erro ao cadastrar usuário: ${errorData.message || 'Erro desconhecido.'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao se conectar ao servidor. Verifique se a API está rodando.');
    }
}
// Função para configurar os eventos do formulário de cadastro de usuarios
function configurarEventos() {
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', cadastrarUsuario);
    }

    const setorSelect = document.getElementById('setor');
    const funcaoSelect = document.getElementById('funcao');
    const campoEspecialidade = document.getElementById('campo-especialidade');
    const campoRegistroCategoria = document.getElementById('campo-registro-categoria');

    // Lógica para carregar funções com base no setor selecionado
    if (setorSelect) {
        setorSelect.addEventListener("change", () => {
            const setorSelecionado = setorSelect.value || "";
            funcaoSelect.innerHTML = "<option selected>Selecione...</option>";

            // Verifica se existem funções para o setor selecionado
            if (funcoesPorSetor[setorSelecionado]) {
                funcoesPorSetor[setorSelecionado].forEach((funcao) => {
                    const option = document.createElement("option");
                    option.value = funcao;
                    option.textContent = funcao;
                    funcaoSelect.appendChild(option);
                });
            } else {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Não há funções disponíveis";
                funcaoSelect.appendChild(option);
            }

            // Mostra ou esconde o campo de registro de categoria
            if (setorSelect && setorSelect.value) {
                const setorSelecionado = setorSelect.value;
                if (["Operacao", "Gestao", " Auditoria", "Farmacia"].includes(setorSelecionado)) {
                    campoRegistroCategoria.classList.remove("d-none");
                } else {
                    campoRegistroCategoria.classList.add("d-none");
                }
            }

            campoEspecialidade.classList.add("d-none");
        });
    }

    // Lógica para mostrar ou esconder campos com base na função selecionada
    if (funcaoSelect) {
        funcaoSelect.addEventListener("change", () => {
            const funcaoSelecionada = funcaoSelect.value;
            if (funcaoSelecionada) {
                if (["Enfermeiro Especialista", "Médico Especialista"].includes(funcaoSelecionada)) {
                    campoEspecialidade.classList.remove("d-none");
                } else {
                    campoEspecialidade.classList.add("d-none");
                }

                if (["Auxiliar Administrativo", "Recepcionista"].includes(funcaoSelecionada)) {
                    campoRegistroCategoria.classList.add("d-none");
                } else {
                    campoRegistroCategoria.classList.remove("d-none");
                }
            }
        });
    }
}

// Função para pesquisar usuários
async function pesquisarUsuarios(event) {
  event.preventDefault(); // Prevents the default form submission

  const campoSelect = document.getElementById('campo-pesquisa');
  const valorInput = document.getElementById('valor-pesquisa');

  if (!campoSelect || !valorInput) {
    console.error('Elementos "campo-pesquisa" e "valor-pesquisa" não encontrados.');
    return;
  }

  const campo = campoSelect.value;
  const valor = valorInput.value;

  if (!campo || !valor) {
    alert('Please fill in all the search fields.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/consultar_usuario?campo=${campo}&valor=${valor}`);
    
    if (!response.ok) {
      const error = new Error(`Error in the request: ${response.statusText}`);
      console.error(error);
      throw error;
    }

    const usuarios = await response.json();
    const listaUsuarios = document.getElementById('usuarios-lista');

    if (!listaUsuarios) {
      const error = new Error('Elemento "usuarios-lista" não encontrado.');
      console.error(error);
      throw error;
    }

    if (!Array.isArray(usuarios) || !usuarios.length) {
      alert('No user found.');
      return;
    }

    // Create a table to display the results
    const tabela = document.createElement('table');
    tabela.className = 'table table-striped';

    // Create the table header
    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow(0);
    linhaCabecalho.innerHTML = `
      <th>Matrícula</th>
      <th>Nome</th>
      <th>CPF</th>
      <th>Setor</th>
      <th>Função</th>
      <th>Especialidade</th>
      <th>Registro Categoria</th>
      <th>Ações</th>
    `;

    // Create the table body
    const corpoTabela = tabela.createTBody();
    usuarios.forEach((usuario) => {
      if (!usuario || !usuario.Matrícula || !usuario.Nome || !usuario.CPF ||
        !usuario.Setor || !usuario.Função || !usuario.Especialidade ||
        !usuario['Registro Categoria']) {
        const error = new Error('Usuário não tem todos os campos necessários.');
        console.error(error);
        throw error;
      }

      const linha = corpoTabela.insertRow();
      linha.innerHTML = `
        <td>${usuario.Matrícula}</td>
        <td>${usuario.Nome}</td>
        <td>${usuario.CPF}</td>
        <td>${usuario.Setor}</td>
        <td>${usuario.Função}</td>
        <td>${usuario.Especialidade}</td>
        <td>${usuario['Registro Categoria']}</td>
        <td>
          <button class="btn btn-danger" onclick="excluirUsuario(${usuario.Matrícula})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
    });

    listaUsuarios.innerHTML = '';
    listaUsuarios.appendChild(tabela);
  } catch (error) {
    console.error(error);
  }
}

// Função para excluir usuário
async function excluirUsuario(matricula) {
    try {
      const response = await fetch(`http://localhost:5000/api/excluir_usuario?matricula=${matricula}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error(`Error in the request: ${response.statusText}`);
      }
  
      const resultado = await response.json();
      alert(resultado.message);
      document.getElementById('searchForm').submit(); // Chama a função pesquisarUsuarios após exclusão
    } catch (error) {
      console.error(error);
    }
  }

  async function mostrarUsuarios() {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios');
      const usuarios = await response.json();
      console.log(usuarios); // Verifica se os dados estão sendo retornados corretamente
      console.log(usuarios.length); // Verifica se existem usuários
      const tabelaUsuarios = document.getElementById('tabela-usuarios');
  
      // Limpa a tabela antes de adicionar novos usuários
      tabelaUsuarios.innerHTML = '';
  
      // Verifica se existem usuários
      if (usuarios.length === 0) {
        tabelaUsuarios.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum usuário encontrado.</td></tr>';
        return;
      }
  
      // Cria a tabela com os cabeçalhos
      const cabecalho = `
        <tr>
          <th>Matrícula</th>
          <th>Nome</th>
          <th>CPF</th>
          <th>Setor</th>
          <th>Função</th>
          <th>Especialidade</th>
          <th>Registro Categoria</th>
          <th>Ações</th>
        </tr>
      `;
  
      // Preenche a tabela com os dados dos usuários
      let corpoTabela = '';
      usuarios.forEach(usuario => {
        console.log(usuario); // Verifica se o objeto usuário está correto
        corpoTabela += `
          <tr>
            <td>${usuario.matricula}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.cpf}</td>
            <td>${usuario.setor}</td>
            <td>${usuario.funcao}</td>
            <td>${usuario.especialidade}</td>
            <td>${usuario.registro_categoria}</td>
            <td>
              <button class="btn btn-danger" onclick="excluirUsuario(${usuario.matricula})">Excluir</button>
            </td>
          </tr>
        `;
      });
  
      // Adiciona a tabela com os dados
      tabelaUsuarios.innerHTML = cabecalho + corpoTabela;
    } catch (error) {
      console.error(error);
    }
  }

// Chama a função carregarUsuarios ao carregar a página
document.addEventListener('DOMContentLoaded', carregarUsuarios);

// Função principal para inicializar o script
function init() {
  configurarEventos();
  carregarUsuarios(); // Carrega a lista de usuários ao iniciar
}

// Chama a função init quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', init);

// Configurar o evento de pesquisa
document.getElementById('searchForm').addEventListener('submit', pesquisarUsuarios);