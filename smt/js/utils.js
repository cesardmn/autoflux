/**
 * Retorna a data e hora atuais no formato `YYYYMMDDHHMMSS`.
 *
 * @returns {string} Uma string representando a data e hora atual no formato `YYYYMMDDHHMMSS`.
 */
export const getTimestamp = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

/**
 * Sanitiza uma string removendo caracteres indesejados e aplicando transformações, como:
 * 1. Remove espaços no início e no final.
 * 2. Substitui tabulações por um espaço.
 * 3. Remove quebras de linha.
 * 4. Remove caracteres de controle ASCII (0-31).
 * 5. Remove caracteres de controle Unicode invisíveis (Zero Width Space, BOM, etc.).
 * 6. Substitui múltiplos espaços consecutivos por um único.
 *
 * @param {string|null|undefined} str A string que será sanitizada. Se `null` ou `undefined`, retorna uma string vazia.
 * @returns {string} A string sanitizada ou uma string vazia caso o resultado da sanitização seja uma string sem conteúdo.
 */
export const sanitizeString = (str) => {
  if (str == null) return ''
  str = String(str)
    .trim()
    .replace(/\t+/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\x00-\x1F]+/g, '')
    .replace(/[\u200B\u200C\u200D\uFEFF\u202F\u00A0]+/g, '')
    .replace(/\s+/g, ' ')
  return str.length === 0 || str === ' ' ? '' : str
}

/**
 * Normaliza uma string removendo acentos e caracteres especiais.
 *
 * @param {string} str A string que será normalizada.
 * @returns {string} A string normalizada, sem acentos.
 */
export const normalizeString = (str) => {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
