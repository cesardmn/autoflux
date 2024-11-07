import { Logger } from './Logger.js'
import { XlsxProcessos } from './xlsx.js'

export const Formater = async (file) => {
  const FormaterResult = {
    originFile: file,
  }

  // CONSTS
  const requiredFields = [
    'Titulo/Outros',
    'Nome Completo',
    'E-mail',
    'DDD',
    'Telefone',
    'cpf_cnpj',
    'CEP',
    'Tipo Logradouro',
    'Logradouro',
    'Bairro',
    'Cidade',
    'UF',
    'Tipo de Endereço',
    'Complemento',
    'Número',
  ]

  // VALIDATORS
  const hasRequiredFields = (dataRow) => {
    return requiredFields.every((field) => field in dataRow)
  }

  const formatRow = (dataRow) => {
    const result = []

    const sanitizeString = (data) => {
      if (typeof data === 'undefined' || data === null) {
        return ''
      }
      return String(data)
        .replace(/[\r\n]+/g, ' ')
        .trim()
        .replace(/[\s\xA0\u2000-\u200B\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[\x00-\x1F\x7F]/g, '')
    }

    const applyTransformations = (value, rule) => {
      let transformedValue = sanitizeString(value)
      transformedValue = rule.digit
        ? transformedValue.replace(/\D/g, '')
        : transformedValue
      transformedValue = rule.padStart
        ? transformedValue.padStart(rule.padStart[0], rule.padStart[1])
        : transformedValue
      transformedValue =
        rule.emptyNum && !transformedValue ? 'S/N' : transformedValue
      transformedValue = rule.upper
        ? transformedValue.toUpperCase()
        : transformedValue
      transformedValue = transformedValue.slice(0, rule.limit)
      return transformedValue
    }

    const rules = {
      'Tipo de Endereço': { limit: 1 },
      UF: { limit: 2, upper: true },
      DDD: { limit: 3, digit: true },
      CEP: { limit: 8, digit: true, padStart: [8, '0'] },
      cpf_cnpj: { limit: 14, digit: true },
      Telefone: { limit: 15, digit: true },
      Número: { limit: 15, emptyNum: true },
      'Titulo/Outros': { limit: 40 },
      Complemento: { limit: 40 },
      'E-mail': { limit: 50 },
      'Nome Completo': { limit: 60 },
      'Tipo Logradouro': { limit: 72 },
      Logradouro: { limit: 72 },
      Bairro: { limit: 72 },
      Cidade: { limit: 72 },
    }

    Object.entries(dataRow).forEach(([chave, valor]) => {
      const rule = rules[chave]
      let formattedValue = ''

      if (rule) {
        formattedValue = applyTransformations(valor, rule)
      } else {
        const showValue = applyTransformations(valor, { limit: 100 })
        formattedValue = `${sanitizeString(chave)}:${sanitizeString(showValue)}`
      }
      result.push(formattedValue)
    })

    return result.join(';')
  }

  const xlsx = await XlsxProcessos.readerXLSX(file)

  if (xlsx.status === 'ok') {
    const data = xlsx.data
    const requiredFields = hasRequiredFields(data[0])
    if (requiredFields) {
      const result = []
      xlsx.data.forEach((dataRow) => {
        const formattedRow = formatRow(dataRow)
        result.push(formattedRow)
      })
      FormaterResult.csvdata = result
    }
  } else {
    Logger.setLog('XlsxProcessos | readerXLSX', xlsx.erro)
    return
  }

  return FormaterResult
}
