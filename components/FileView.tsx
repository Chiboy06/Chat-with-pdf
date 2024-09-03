
'use client'
import React from 'react'
import { useMediaQuery } from "react-responsive";
import PdfView from './PdfView';
import MobileView from './MobileView';



function FileView({ url }: { url: string }) {
    const Mobile = useMediaQuery({ query: '(max-width: 1224px)' })
    return (
    <>
        {
            Mobile ? (
            <MobileView url={url} />
            ) : (
            <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
                {/* PDFView */}
                <PdfView url={url} />
            </div>
            )
        }
    </>
)}

export default FileView