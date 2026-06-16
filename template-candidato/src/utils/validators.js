// Regex simples para validação de e-mail (suficiente para o cadastro de clientes).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRequired(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isEmail(value) {
  return EMAIL_REGEX.test(String(value).trim());
}

/**
 * Valida os campos do formulário de cliente.
 * Retorna um objeto de erros (campo → mensagem); vazio quando tudo é válido.
 */
export function validarCliente({ nome, email, telefone }) {
  const erros = {};

  if (!isRequired(nome)) {
    erros.nome = 'Informe o nome do cliente.';
  }

  if (!isRequired(email)) {
    erros.email = 'Informe o e-mail.';
  } else if (!isEmail(email)) {
    erros.email = 'Informe um e-mail válido.';
  }

  if (!isRequired(telefone)) {
    erros.telefone = 'Informe o telefone.';
  }

  return erros;
}

/**
 * Valida os campos do formulário de ordem de serviço.
 * Retorna um objeto de erros (campo → mensagem); vazio quando tudo é válido.
 */
export function validarOrdemServico({ cliente_id, descricao, valor }) {
  const erros = {};

  if (!isRequired(cliente_id)) {
    erros.cliente_id = 'Selecione um cliente.';
  }

  if (!isRequired(descricao)) {
    erros.descricao = 'Descreva o problema.';
  }

  const valorNumerico = Number(valor);
  if (!isRequired(valor)) {
    erros.valor = 'Informe o valor.';
  } else if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
    erros.valor = 'Informe um valor maior que zero.';
  }

  return erros;
}
