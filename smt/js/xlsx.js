export const XlsxProcessos = (() => {
  const readerXLSX = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const data = reader.result
          const workbook = XLSX.read(new Uint8Array(data), { type: 'array' })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
          resolve({
            status: 'ok',
            data: json,
          })
        } catch (error) {
          resolve({
            status: 'nok',
            erro: `Erro ao processar o arquivo XLSX: ${error.message}`,
          })
        }
      }

      reader.onerror = (error) => {
        resolve({
          status: 'nok',
          erro: `Erro ao ler o arquivo: ${error.message}`,
        })
      }

      reader.readAsArrayBuffer(file)
    })
  }

  return {
    readerXLSX,
  }
})()
