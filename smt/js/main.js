import { Formater } from './Formater.js'
import { generateCSV } from './CSV.js'
import { getTimestamp } from '../../src/js/Utils.js'

const app = () => {
  const dropArea = document.querySelector('#drop-area')
  const drop = document.querySelector('.drop')
  const inputFile = document.querySelector('#plan')
  const display = document.querySelector('#display')

  const setDropListeners = () => {
    dropArea.onclick = (e) => {
      e.preventDefault()
      inputFile.click()
    }

    dropArea.ondragover = (e) => {
      e.preventDefault()
      dropArea.classList.add('dragging')
    }

    dropArea.ondragleave = (e) => {
      e.preventDefault()
      dropArea.classList.remove('dragging')
    }

    dropArea.ondrop = (e) => {
      e.preventDefault()
      dropArea.classList.remove('dragging')
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }

  inputFile.onchange = (e) => {
    const file = inputFile.files[0]
    processFile(file)
  }

  const processFile = async (file) => {
    if (!file) {
      display.textContent = 'Nenhum arquivo selecionado.'
      return
    }

    const isXlsxFile = file.name.endsWith('.xlsx')
    if (!isXlsxFile) {
      display.textContent =
        'Arquivo inválido. Por favor, selecione um arquivo .xlsx'
      return
    }

    try {
      const result = await Formater(file)
      const generatedData = await generateCSV(result)

      if (generatedData instanceof Blob) {
        const fileExtension =
          generatedData.type === 'application/zip' ? 'zip' : 'csv'
        const fileName = `dados_${getTimestamp()}.${fileExtension}`
        createDownloadLink(generatedData, fileName)
      } else {
        display.textContent = 'Erro ao gerar os dados. Tente novamente.'
      }
    } catch (error) {
      display.textContent = `Erro ao processar o arquivo: ${error.message}`
    }
  }

  const createDownloadLink = (blob, filename) => {
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.textContent = `Baixar dados`

    drop.appendChild(link)
    dropArea.style.display = 'none'

    link.addEventListener('click', () => {
      setTimeout(() => {
        URL.revokeObjectURL(url)
        link.remove()
        dropArea.style.display = 'flex'
      }, 0)
    })
  }

  setDropListeners()
}

window.onload = () => {
  app()
}
