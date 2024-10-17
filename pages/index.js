import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    // Fetch the list of uploaded files when the component mounts
    fetchUploadedFiles()
  }, [])

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('/.netlify/functions/getFiles')
      if (response.ok) {
        const files = await response.json()
        setUploadedFiles(files)
      } else {
        console.error('Failed to fetch uploaded files')
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('File uploaded successfully:', result)
        // Refresh the list of uploaded files
        fetchUploadedFiles()
      } else {
        console.error('File upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
      setFile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Reditoo - File Uploader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Reditoo File Uploader</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* File list */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Uploaded Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.file_id} className="bg-white p-4 rounded-lg shadow">
                  <p className="font-semibold truncate">{file.file_name}</p>
                  <p className="text-sm text-gray-500">{file.file_size} bytes</p>
                </div>
              ))}
            </div>
          </div>

          {/* File upload form */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Upload New File</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a file
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}