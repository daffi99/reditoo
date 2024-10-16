import { useState, useEffect } from 'react'

export default function Home() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchFiles()
  }, [])

  async function fetchFiles() {
    const response = await fetch('/.netlify/functions/getFiles')
    const data = await response.json()
    setFiles(data)
  }

  function handleFileChange(event) {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  async function handleFileUpload() {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result
        const response = await fetch('/.netlify/functions/uploadFile', {
          method: 'POST',
          body: JSON.stringify({ name: selectedFile.name, content: base64 }),
        })

        if (response.ok) {
          setSuccessMessage('File uploaded successfully!')
          setSelectedFile(null)
          fetchFiles()
        } else {
          setSuccessMessage('Failed to upload file.')
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  async function handleFileDownload(fileId) {
    const response = await fetch('/.netlify/functions/getFile', {
      method: 'POST',
      body: JSON.stringify({ fileId }),
    })
    const data = await response.json()
    window.open(data.downloadUrl, '_blank')
  }

  return (
    <div>
      <h1>TeleDrive</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!selectedFile}>
        Submit
      </button>
      {successMessage && <p>{successMessage}</p>}
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.name} - {file.size}
            <button onClick={() => handleFileDownload(file.id)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
