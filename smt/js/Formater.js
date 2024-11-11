import { Logger } from './Logger.js'
import { XlsxProcessos } from './xlsx.js'
import { normalizeString, sanitizeString } from './utils.js'

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
      if (rule.validateTipoEndereco) {
        transformedValue = ['I', 'N'].includes(transformedValue)
          ? transformedValue
          : 'N'
      }

      transformedValue = transformedValue.slice(0, rule.limit)

      return transformedValue
    }

    const rules = {
      'Tipo de Endereço': { limit: 1, upper: true, validateTipoEndereco: true },
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
      let formattedValue = ''

      // Limpar e normalizar cabeçalhos não obrigatórios
      let cleanedKey = sanitizeString(chave)

      // Se a chave não está em requiredFields, normalizar
      if (!requiredFields.includes(cleanedKey)) {
        cleanedKey = normalizeString(cleanedKey)
      }

      // Ignorar cabeçalhos vazios ou com apenas espaços
      if (!cleanedKey) {
        return // Se a chave estiver vazia, não processa essa coluna
      }

      // Verificar se o cabeçalho está nos requiredFields
      const isRequiredField = requiredFields.includes(cleanedKey)

      if (!isRequiredField) {
        // Cabeçalhos não obrigatórios: aplicar sanitização e normalização
        formattedValue = `${cleanedKey}:${sanitizeString(valor)}`
      } else {
        const rule = rules[cleanedKey]

        // Aplicar transformações com base nas regras definidas
        if (rule) {
          formattedValue = applyTransformations(valor, rule)
        } else {
          const showValue = applyTransformations(valor, { limit: 100 })
          formattedValue = `${cleanedKey}:${sanitizeString(showValue)}`
        }
      }

      // Normalizar o valor final
      formattedValue = normalizeString(formattedValue)

      result.push(formattedValue)
    })

    return result.join(';')
  }

  const xlsx = await XlsxProcessos.readerXLSX(file)
  console.log(xlsx)

  if (xlsx.status === 'ok') {
    const data = xlsx.data
    const requiredFieldsCheck = hasRequiredFields(data[0])
    if (requiredFieldsCheck) {
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
