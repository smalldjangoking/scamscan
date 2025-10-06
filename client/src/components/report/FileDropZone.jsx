import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export default function Dropzone({ onFilesSelected }) {
    const onDrop = useCallback((acceptedFiles) => {
        onFilesSelected(acceptedFiles);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxSize: 5 * 1024 * 1024,
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className="text-muted-foreground flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:text-primary md:w-[150px]"
        >
            <input {...getInputProps()} />

            {isDragActive ? (
                <>
                    <Upload className="mb-2 h-8 w-8" />
                    <p>Drop here</p>
                </> 
            ) : (
                    <>
                        <Upload className="mb-2 h-8 w-8" />
                        <p>Click to Upload</p>
                    </>
            )}
        </div>
    );
}
