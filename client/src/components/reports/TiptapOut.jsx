import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from 'react'
import { Mouse } from 'lucide-react';

export function TiptapViewer({ html }) {
  const [openFull, setOpenFull] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
    ],
    content: html || "",
    editable: false,
  });

  if (!editor) return null;

  return (
    <div onClick={() => setOpenFull(true)} className={`${openFull ? '' : ''} relative`}>
      <div
        className={
          `
                prose prose-sm dark:prose-invert 
                max-w-full 
                break-words 
                overflow-x-auto
                [&_*]:max-w-full 
                [&_*]:box-border
                [&_img]:max-w-full [&_img]:h-auto
                [&_table]:w-full [&_table]:max-w-full
                [&_pre]:whitespace-pre-wrap
                [&_pre]:break-words
                [&_pre]:max-w-full
                [&_code]:break-words
                ${openFull ? "" : " line-clamp-5"}
                `
        }
      >
        <EditorContent editor={editor} />
      </div>
      <div className={`pointer-events-none absolute bottom-0 left-0 right-0 h-100 bg-gradient-to-t from-background to-transparent ${openFull ? 'hidden' : ''}`} />
      <div className={`absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center gap-1 py-3 
text-sm font-medium text-muted-foregroun cursor-pointer transition hover:text-primary ${openFull ? 'hidden' : ''}`}>
        <span>Click to Expand</span>
        <Mouse className="w-4 h-4 animate-bounce opacity-70" />
      </div>
    </div>
  );
}