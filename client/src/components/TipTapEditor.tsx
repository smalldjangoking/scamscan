import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { 
    Bold, 
    Italic, 
    Strikethrough, 
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo
} from 'lucide-react'

const Tiptap = ({ content, onChange }: { content?: string; onChange?: (content: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'I sent USDT to the wallet address 0x93af...c29d after the owner claimed he could double my investment in a day. Once he got the payment, he blocked all communication.',
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML())
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none min-h-[150px] p-4 text-foreground',
            },
        },
    })

    if (!editor) return null

    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="flex flex-wrap gap-1 border-b border-border p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Back"
                >
                    <Undo className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Ahead"
                >
                    <Redo className="h-4 w-4" />
                </button>

                <div className="mx-2 w-px bg-border"></div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-accent ${
                        editor.isActive('bold') ? 'bg-accent text-primary' : ''
                    }`}
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-accent ${
                        editor.isActive('italic') ? 'bg-accent text-primary' : ''
                    }`}
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-accent ${
                        editor.isActive('strike') ? 'bg-accent text-primary' : ''
                    }`}
                >
                    <Strikethrough className="h-4 w-4" />
                </button>

                <div className="mx-2 w-px bg-border"></div>
            </div>

            <div className="min-h-[150px]">
                <EditorContent editor={editor} />
            </div>

            {/* Characters counter */}
            <div className="text-muted-foreground border-t border-border p-2 text-xs">
                {editor.storage.characterCount?.characters() || editor.getText().length} - max: 2000
            </div>
        </div>
    )
}

export default Tiptap