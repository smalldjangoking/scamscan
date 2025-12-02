// src/components/report/TipTapEditor.tsx

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    Strikethrough,
    Undo,
    Redo,
    List,
    ListOrdered,
    Quote,
    Code,
    Heading2,
    Minus,
    Eraser,
} from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "../ui/Button";

const MAX_CHARACTERS = 2000;

type TiptapProps = {
    content?: string;
    onChange?: (content: string) => void;
    onBlur?: () => void;
    error?: boolean;
};

const Tiptap: React.FC<TiptapProps> = ({ content, onChange, onBlur, error }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2], // мы используем H2 в тулбаре
                },
                // Остальное оставляем включённым (по дефолту и так true)
                // но конфиг через StarterKit.configure делает намерение явным
            }),
            Placeholder.configure({
                placeholder:
                    "I sent USDT to the wallet address 0x93af...c29d after the owner claimed he could double my investment in a day. Once he got the payment, he blocked all communication.",
            }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        onBlur: ({ editor }) => {
            onChange?.(editor.getHTML());
            onBlur?.();
        },
        editorProps: {
            attributes: {
                class: cn(
                    // базовые стили контейнера
                    "block w-full min-h-[150px] p-4 text-foreground focus:outline-none",
                    // перенос строк и длинных слов, чтобы не было горизонтального скролла
                    "whitespace-pre-wrap break-words",
                    // базовая типографика для контента
                    "text-sm leading-relaxed",
                    // списки
                    "[&_ul]:list-disc [&_ul]:pl-6",
                    "[&_ol]:list-decimal [&_ol]:pl-6",
                    // цитаты
                    "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
                    // код-блоки
                    "[&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-3 [&_pre]:overflow-x-auto",
                    "[&_code]:font-mono",
                    // заголовок H2
                    "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1"
                ),
            },
        },
    });

    // Синхронизация внешнего content с редактором
    useEffect(() => {
        if (!editor) return;
        if (content !== undefined && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    if (!editor) return null;

    const currentCount = editor.getText().length;
    const isOverLimit = currentCount > MAX_CHARACTERS;

    const ALLOWED_ATTRIBUTES = []

    return (
        <div
            className={cn(
                "rounded-lg border border-border bg-card",
                error && "border-destructive ring-destructive/20 ring-[3px]"
            )}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b border-border p-2">
                {/* Undo / Redo */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>

                <div className="mx-2 w-px bg-border" />

                {/* B / I / S */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                        editor.isActive("bold") && "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("bold")}
                    aria-label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                        editor.isActive("italic") && "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("italic")}
                    aria-label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn(
                        editor.isActive("strike") && "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("strike")}
                    aria-label="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <div className="mx-2 w-px bg-border" />

                {/* Heading + Lists */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={cn(
                        editor.isActive("heading", { level: 2 }) &&
                            "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("heading", { level: 2 })}
                    aria-label="Heading level 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={cn(
                        editor.isActive("bulletList") &&
                            "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("bulletList")}
                    aria-label="Bullet list"
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={cn(
                        editor.isActive("orderedList") &&
                            "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("orderedList")}
                    aria-label="Numbered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="mx-2 w-px bg-border" />

                {/* Quote / Code / HR / Clear */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={cn(
                        editor.isActive("blockquote") &&
                            "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("blockquote")}
                    aria-label="Quote"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={cn(
                        editor.isActive("codeBlock") &&
                            "bg-accent text-primary"
                    )}
                    aria-pressed={editor.isActive("codeBlock")}
                    aria-label="Code block"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    title="Insert horizontal line"
                    aria-label="Insert horizontal line"
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().clearNodes().unsetAllMarks().run()
                    }
                    title="Clear formatting"
                    aria-label="Clear formatting"
                >
                    <Eraser className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <div className="min-h-[150px]">
                <EditorContent editor={editor} />
            </div>

            {/* Character counter */}
            <div className="flex items-center justify-between border-t border-border p-2 text-xs">
                <span
                    className={cn(
                        "text-muted-foreground",
                        isOverLimit && "text-destructive font-medium"
                    )}
                >
                    {currentCount} / {MAX_CHARACTERS}
                </span>
                {isOverLimit && (
                    <span className="text-destructive">
                        Text is too long. Please shorten it.
                    </span>
                )}
            </div>
        </div>
    );
};

export default Tiptap;
