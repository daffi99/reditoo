import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, Image, FileText, Folder } from "lucide-react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    // Simulated fetch - replace with actual API call
    setFiles([
      { id: 1, name: 'Document.pdf', type: 'pdf', size: '2.3 MB' },
      { id: 2, name: 'Image.jpg', type: 'image', size: '1.5 MB' },
      { id: 3, name: 'Spreadsheet.xlsx', type: 'spreadsheet', size: '500 KB' },
      { id: 4, name: 'Project Files', type: 'folder', size: '15 MB' },
      { id: 5, name: 'Presentation.pptx', type: 'presentation', size: '3.2 MB' },
      { id: 6, name: 'Video.mp4', type: 'video', size: '25 MB' },
      { id: 7, name: 'Notes.txt', type: 'text', size: '10 KB' },
      { id: 8, name: 'Archive.zip', type: 'archive', size: '50 MB' },
    ]);
  }

  function getFileIcon(type) {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" />;
      case 'image': return <Image className="text-blue-500" />;
      case 'folder': return <Folder className="text-yellow-500" />;
      case 'presentation': return <File className="text-orange-500" />;
      case 'video': return <File className="text-purple-500" />;
      case 'text': return <File className="text-green-500" />;
      case 'archive': return <File className="text-indigo-500" />;
      default: return <File className="text-gray-500" />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Files</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedFile(file)}>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="p-3 bg-gray-100 rounded-full mb-2">
                  {React.cloneElement(getFileIcon(file.type), { className: `h-8 w-8 ${getFileIcon(file.type).props.className}` })}
                </div>
                <p className="text-sm font-medium text-center truncate w-full">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="w-80 bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Upload</h2>
        <Input type="file" className="mb-4" />
        <Button className="w-full">
          <Upload className="mr-2 h-4 w-4" /> Upload File
        </Button>
        {selectedFile && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">File Details</h3>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
            <p><strong>Size:</strong> {selectedFile.size}</p>
          </div>
        )}
      </div>
    </div>
  );
}