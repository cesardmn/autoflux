import { Xlsx } from '../../src/js/Xlsx.js'
import { normalizeString, sanitizeString } from '../../src/js/Utils.js'

export const Formater = async (file) => {
  const REQUIRED_FIELDS = [
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

  const formatKey = (key) => {
    const isRequiredField = REQUIRED_FIELDS.includes(key)
    if (isRequiredField) {
      return ''
    } else {
      const sanitizedString = sanitizeString(key)
      const normalizedString = normalizeString(sanitizedString)
      return normalizedString !== '' ? `${normalizedString}:` : ''
    }
  }

  const formatValue = (key, value) => {
    let sanitizedString = sanitizeString(value)
    let normalizedString = normalizeString(sanitizedString)
    normalizedString = normalizedString !== '' ? normalizedString : ''

    if (key === 'Tipo de Endereço') {
      normalizedString = normalizedString.slice(0, 1).toUpperCase()
      return ['I', 'N'].includes(normalizedString) ? normalizedString : 'N'
    }

    if (key === 'UF') {
      return normalizedString.toUpperCase().slice(0, 2)
    }

    if (key === 'DDD') {
      return normalizedString.replace(/\D/g, '').slice(0, 3)
    }

    if (key === 'CEP') {
      return normalizedString.replace(/\D/g, '').slice(0, 8).padStart(8, '0')
    }

    if (key === 'cpf_cnpj') {
      return normalizedString.replace(/\D/g, '').slice(0, 14)
    }

    if (key === 'Telefone') {
      return normalizedString.replace(/\D/g, '').slice(0, 15)
    }

    if (key === 'Número') {
      normalizedString = normalizedString.replace(/\D/g, '').slice(0, 15)
      return normalizedString !== '' ? normalizedString : 'S/N'
    }

    if (key === 'Titulo/Outros' || key === 'Complemento') {
      return normalizedString.slice(0, 40)
    }

    if (key === 'E-mail') {
      return normalizedString.slice(0, 50)
    }

    if (key === 'Nome Completo') {
      return normalizedString.slice(0, 60)
    }

    if (
      key === 'Tipo Logradouro' ||
      key === 'Logradouro' ||
      key === 'Bairro' ||
      key === 'Cidade'
    ) {
      return normalizedString.slice(0, 72)
    }

    return normalizedString.slice(0, 100)
  }

  const formatRow = (item) => {
    const formattedRow = []

    Object.entries(item).forEach(([key, value]) => {
      const formatedKey = formatKey(key)
      const formatedValue = formatValue(key, value)

      const dataVal = `${formatedKey}${formatedValue}`

      if (REQUIRED_FIELDS.includes(key)) {
        formattedRow.push(dataVal)
      } else {
        dataVal !== '' && formattedRow.push(dataVal)
      }
    })

    return formattedRow.join(';')
  }

  const FormaterResult = { originFile: file, csvdata: [] }
  const xlsx = await Xlsx.readerXLSX(file)

  if (xlsx.status === 'ok') {
    const dataJson = xlsx.data

    const hasRequiredFields = REQUIRED_FIELDS.every(
      (field) => field in dataJson[0]
    )

    if (hasRequiredFields) {
      dataJson.forEach((item) => {
        const formattedRow = formatRow(item)
        FormaterResult.csvdata.push(formattedRow)
      })
    }
  }
  return FormaterResult
}
