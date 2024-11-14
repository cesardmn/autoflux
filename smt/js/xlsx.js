export const XlsxProcessos = (() => {
  const readerXLSX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(sheet, { defval: '' })
      return {
        status: 'ok',
        data,
      }
    } catch (error) {
      return {
        status: 'nok',
        error,
      }
    }
  }

  return {
    readerXLSX,
  }
})()
