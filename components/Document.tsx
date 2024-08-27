"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import { useTransition } from "react";
import { Button } from "./ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { deleteDocument } from "@/actions/deleteDocument";

function DocumentFile({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) {
  const router = useRouter();
  const [isDeleting, startTransaction] = useTransition();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(0.3);
    const { hasActiveMembership } = useSubscription();
  

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch(downloadUrl);
      const file = await response.blob();

      setFile(file);
    };

    fetchFile();
  }, [downloadUrl]);

  return (
    <div className="flex flex-col w-72 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-indigo-600 hover:text-black cursor-pointer group">
      <div
        className="flex-1 relative z-10 overflow-none"
        onClick={() => {
          router.push(`/dashboard/files/${id}`);
        }}
      >
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-gray-500 group-hover:text-indigo-100">
          {/* render size in kbs */}
          {byteSize(size).value} KB
        </p>
        <Document
          loading={null}
          file={file}
          // // rotate={rotation}
          // // onLoadSuccess={onDocumentLoadSuccess}
          className=" w-full h-full absolute -z-10 top-0"
        >
          <Page className="shadow-lg w-10 h-10" scale={scale} height={400} width={650} pageNumber={pageNumber} />
        </Document>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 relative z-10 justify-end">
        <Button
          variant="outline"
          disabled={isDeleting || !hasActiveMembership}
          onClick={() => {
            const prompt = window.confirm(
              "Are you sure you want to delete this document?"
            );

            if (prompt) {
              // delete document
              startTransaction(async () => {
                await deleteDocument(id);
              });
            }
          }}
        >
          <Trash2Icon className="h-6 w-6 text-red-500" />
          {!hasActiveMembership && (
            <span className="text-red-500 ml-2">PRO Feature</span>
          )}
        </Button>

        <Button variant="outline" asChild>
          <a href={downloadUrl} download>
            <DownloadCloud className="h-6 w-6 text-indigo-600" />
          </a>
        </Button>
      </div>
    </div>
  );
}
export default DocumentFile;