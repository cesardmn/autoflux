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
export const sanitizeString = (str) => {
  /**
   * ordem de replace:
   * Remove espaços no início e no final
   * Substitui tabulações por espaço
   * Remove quebras de linha
   * Remove caracteres de controle ASCII (0-31)
   * Remove caracteres de controle Unicode invisíveis (Zero Width Space, BOM, etc.)
   * Substitui múltiplos espaços consecutivos por um único
   */
  
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
