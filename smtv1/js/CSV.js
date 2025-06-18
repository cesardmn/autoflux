import { getTimestamp } from '../../src/js/Utils.js'

export const generateCSV = (data) => {
  // Função para criar o ZIP com os dados CSV
  const createZip = (chunks, timestamp) => {
    const zip = new JSZip()

    chunks.forEach((chunk, index) => {
      const csvContent = chunk.join('\n')
      zip.file(`dados_parte_${index + 1}_${timestamp}.csv`, csvContent)
    })

    return zip.generateAsync({ type: 'blob' })
  }

  // Função para criar o CSV com os dados
  const createDownloadLink = (csvContent, filename) => {
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  }

  // Definir o número máximo de linhas por arquivo
  const maxLinesPerFile = 200
  const lines = data.csvdata

  // Fracionar os dados em partes de até 200 linhas
  const chunks = []
  for (let i = 0; i < lines.length; i += maxLinesPerFile) {
    chunks.push(lines.slice(i, i + maxLinesPerFile))
  }

  // Gerar o timestamp para o nome do arquivo
  const timestamp = getTimestamp()

  // Se houver apenas uma parte, cria um arquivo CSV diretamente
  if (chunks.length === 1) {
    const csvContent = chunks[0].join('\n')
    return createDownloadLink(csvContent, `dados_${timestamp}.csv`)
  } else {
    // Caso haja mais de uma parte, cria um arquivo ZIP
    return createZip(chunks, timestamp)
  }
}
