document.addEventListener("DOMContentLoaded", () => {
  const nome = document.getElementById("nome");
  const cpf = document.getElementById("cpf");
  const endereco = document.getElementById("endereco");
  const setorSelect = document.getElementById("setor");
  const funcaoSelect = document.getElementById("funcao");
  const campoEspecialidade = document.getElementById("campo-especialidade");
  const campoRegistroCategoria = document.getElementById(
    "campo-registro-categoria"
  );
  const registro = document.getElementById("registro");
  const userForm = document.getElementById("userForm");
  const btnSalvar = userForm
    ? userForm.querySelector("button[type='submit']")
    : null;
  const btnCancelar = userForm
    ? userForm.querySelector("button[type='reset']")
    : null;


    if (userForm) {
      userForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
  
        const formData = {
          nome: document.getElementById("nome").value,
          cpf: document.getElementById("cpf").value,
          endereco: document.getElementById("endereco").value,
          setor: setorSelect.value,
          funcao: funcaoSelect.value,
          especialidade: document.getElementById("especialidade").value,
          registro_categoria: document.getElementById("registro").value,
        };
  
        try {
          const response = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
              'Content -Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
  
          if (response.ok) {
            const result = await response.json();
            alert(result.message);
            userForm.reset(); // Limpa o formulário após o envio
          } else {
            alert('Erro ao criar usuário.');
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Erro ao se conectar ao servidor.');
        }
      });
    }
  });

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

  setorSelect.addEventListener("change", () => {
    const setorSelecionado = setorSelect.value || "";

    funcaoSelect.innerHTML = "<option selected>Selecione...</option>";

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

    if (
      ["Operacao", "Gestao", "Auditoria", "Farmacia"].includes(setorSelecionado)
    ) {
      campoRegistroCategoria.classList.remove("d-none");
    } else {
      campoRegistroCategoria.classList.add("d-none");
    }

    campoEspecialidade.classList.add("d-none");
  });

  funcaoSelect.addEventListener("change", () => {
    const funcaoSelecionada = funcaoSelect.value || "";

    if (
      ["Enfermeiro Especialista", "Médico Especialista"].includes(
        funcaoSelecionada
      )
    ) {
      campoEspecialidade.classList.remove("d-none");
    } else {
      campoEspecialidade.classList.add("d-none");
    }

    if (
      [
        "Auxiliar Administrativo",
        "Motorista",
        "Assistente de Recurso de Glosa",
        "Gerente Administrativo",
        "Gerente de Recursos Humanos",
        "Coordenador de Recursos Humanos e Departamento Pessoal",
        "Coordenador Financeiro",
        "Auxiliar de Farmácia",
        "Gestor de Insumos",
      ].includes(funcaoSelecionada)
    ) {
      campoRegistroCategoria.classList.add("d-none");
    } else if (
      ["Operacao", "Gestao", "Auditoria", "Farmacia"].includes(
        setorSelect.value
      )
    ) {
      campoRegistroCategoria.classList.remove("d-none");
    }
  });

  btnCancelar.addEventListener("click", () => {
    funcaoSelect.innerHTML = "<option selected>Selecione...</option>";
    campoEspecialidade.classList.add("d-none");
    campoRegistroCategoria.classList.add("d-none");
  });

