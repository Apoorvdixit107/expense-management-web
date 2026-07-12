import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="mt-10 text-xl font-bold tracking-tight text-[#212121]">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 text-lg font-bold tracking-tight text-[#212121]">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mt-5 text-base leading-relaxed text-[#6b6b6b]">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-[#6b6b6b]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-base leading-relaxed text-[#6b6b6b]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-[#212121]">{children}</strong>
        ),
        a: ({ href, children }) => (
          <a href={href} className="font-medium text-brand underline-offset-2 hover:underline">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-5 border-l-4 border-brand/40 bg-[#fafafa] py-3 pl-4 text-base leading-relaxed text-[#6b6b6b]">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b border-[#ebebeb]">{children}</thead>,
        th: ({ children }) => (
          <th className="px-3 py-2 font-semibold text-[#212121]">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-b border-[#ebebeb] px-3 py-2 text-[#6b6b6b]">{children}</td>
        ),
        hr: () => <hr className="my-10 border-[#ebebeb]" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
