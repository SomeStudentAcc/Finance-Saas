'use client'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import React from 'react'
import {useCSVReader} from 'react-papaparse'

type Props = {
    onUpload: (results: any)=> void
}

export default function UploadButton({onUpload}:Props) {
    const {CSVReader} = useCSVReader() 
  return (
    <CSVReader onUploadAccepted={onUpload}>
        {({getRootProps}: any)=>(
            <Button {...getRootProps()} size={'sm'} className='w-full lg:w-auto'>
                <Upload className='size-4 mr-2'/>
                Import

            </Button>
        )}
    </CSVReader>
  )
}
