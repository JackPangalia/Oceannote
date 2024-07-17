import Link from "next/link"

const Notetab = ({title, paragraphSnippet, onContextMenu, link}) => {
  return (
    <Link href = {link} className = 'dark:bg-darkMode bg-zinc-100 rounded-lg hover:bg-zinc-200 flex flex-col px-4 py-2 text-sm max-w-[22.5rem] transition-all duration-200' onContextMenu={onContextMenu}>
      <h4 className = 'font-semibold'>{title}</h4>
      <p className = 'text-sm'>{paragraphSnippet}</p>
    </Link>
  )
}

export default Notetab