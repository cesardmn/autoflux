import { Formater } from './Formater.js'
import { generateCSV } from './CSV.js'
import { getTimestamp } from './utils.js'

const dropArea = document.querySelector('#drop-area')
const drop = document.querySelector('.drop')
const inputFile = document.querySelector('#plan')
const display = document.querySelector('#display')

// Função para processar o arquivo
async function processFile(file) {
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

  const result = await Formater(file)

  const generatedData = await generateCSV(result)

  // Verifica o tipo de `generatedData` e gera o link de download adequado
  if (generatedData instanceof Blob) {
    const fileExtension =
      generatedData.type === 'application/zip' ? 'zip' : 'csv'
    const fileName = `dados_${getTimestamp()}.${fileExtension}`
    createDownloadLink(generatedData, fileName)
  }
}

// Função para gerar o link de download
function createDownloadLink(blob, filename) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.textContent = `baixar dados`

  // Adiciona o link ao DOM
  drop.appendChild(link)
  dropArea.style.display = 'none'

  // Remove o link após o clique e libera a URL
  link.addEventListener('click', () => {
    setTimeout(() => {
      URL.revokeObjectURL(url) // Libera o objeto URL após o clique
      link.remove() // Remove o link do DOM
      dropArea.style.display = 'flex'
    }, 0)
  })
}

// Quando o usuário clica na área de arraste, o input de arquivo é acionado
dropArea.addEventListener('click', (e) => {
  e.preventDefault()
  inputFile.click()
})

// Quando o usuário seleciona um arquivo diretamente via input
inputFile.addEventListener('change', (e) => {
  const file = inputFile.files[0]
  processFile(file)
})

// Previne o comportamento padrão de arrastar e soltar (por exemplo, abrir o arquivo no navegador)
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault()
  dropArea.classList.add('dragging') // Adiciona estilo visual quando o arquivo está sendo arrastado
})

dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault()
  dropArea.classList.remove('dragging') // Remove o estilo visual
})

// Quando o arquivo é solto na área de arraste
dropArea.addEventListener('drop', (e) => {
  e.preventDefault()
  dropArea.classList.remove('dragging') // Remove o estilo visual

  const file = e.dataTransfer.files[0]
  processFile(file) // Processa o arquivo
})
