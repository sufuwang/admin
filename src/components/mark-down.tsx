import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownWrapper({ children }: { children: string }) {
  return (
    <div
      className="
        text-gray-800 dark:text-gray-200 leading-relaxed

        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4
        [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3
        [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2
        [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mt-4 [&>h4]:mb-2

        [&>p]:my-3
        [&>ul]:list-disc [&>ul]:ml-6 [&>ul>li]:my-1
        [&>ol]:list-decimal [&>ol]:ml-6 [&>ol>li]:my-1

        [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500
        [&>blockquote]:pl-4 [&>blockquote]:py-2
        [&>blockquote]:bg-blue-50 dark:[&>blockquote]:bg-blue-900/20
        [&>blockquote]:rounded

        [&_table]:w-full [&_table]:border-collapse
        [&_th]:border [&_th]:border-[--sidebar-border] [&_th]:p-2 [&_th]:bg-[--muted] [&_th]:text-left
        [&_td]:border [&_td]:border-[--sidebar-border] [&_td]:p-2

        [&>code]:bg-gray-100 dark:[&>code]:bg-gray-800
        [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded text-sm

        [&>pre]:bg-gray-900 dark:[&>pre]:bg-gray-800
        [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto

        [&>hr]:my-2
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
