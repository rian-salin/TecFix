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
