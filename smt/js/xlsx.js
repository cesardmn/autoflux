export const XlsxProcessos = (() => {
  const readerXLSX = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const data = reader.result
          const workbook = XLSX.read(new Uint8Array(data), { type: 'array' })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          const json = XLSX.utils.sheet_to_json(sheet, {
            header: 1, // Usa a primeira linha como cabeçalho
            defval: '', // Define o valor padrão para células vazias
            raw: true, // Não tenta formatar os dados
          })

          // Se o arquivo estiver vazio ou não tiver conteúdo relevante
          if (!json || json.length === 0) {
            resolve({
              status: 'nok',
              erro: 'O arquivo está vazio ou não contém dados válidos.',
            })
            return
          }

          const headers = json[0] // Primeira linha como cabeçalho
          const result = json.slice(1) // Remove a primeira linha (cabeçalho)

          // Filtra as linhas vazias antes de processar
          const filteredRows = result.filter((row) =>
            row.some(
              (cell) => cell !== '' && cell !== null && cell !== undefined
            )
          )

          // Mapeia as linhas restantes para objetos usando os cabeçalhos
          const dataObjects = filteredRows.map((row) => {
            let obj = {}
            headers.forEach((header, index) => {
              obj[header] = row[index] || '' // Adiciona a célula ao objeto ou '' se estiver vazio
            })
            return obj
          })

          resolve({
            status: 'ok',
            data: dataObjects,
          })
        } catch (error) {
          resolve({
            status: 'nok',
            erro: 'Erro ao processar o arquivo XLSX: ' + error,
          })
        }
      }

      reader.onerror = (error) => {
        resolve({
          status: 'nok',
          erro: 'Erro ao ler o arquivo: ' + error,
        })
      }

      reader.readAsArrayBuffer(file) // Lê o arquivo como ArrayBuffer
    })
  }

  return {
    readerXLSX,
  }
})()
