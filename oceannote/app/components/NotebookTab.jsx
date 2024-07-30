import Link from "next/link"

const NotebookTab = ({color}) => {
  return (
    <Link href = '#' className = 'flex h-[9rem] transition-all duration-500 shadow-md rounded  '>
      <div className = 'bg-gray-600 w-[3px] text-white flex flex-col justify-around  '>
        <div className = 'bg-gray-600 w-4 h-[3px] relative rounded right-[6px]'></div>
        <div className = 'bg-gray-600 w-4 h-[3px] relative rounded right-[6px]'></div>
        <div className = 'bg-gray-600 w-4 h-[3px] relative rounded right-[6px]'></div>
        <div className = 'bg-gray-600 w-4 h-[3px] relative rounded right-[6px]'></div>
        <div className = 'bg-gray-600 w-4 h-[3px] relative rounded right-[6px]'></div>
        <div className = 'bg-gray-600 w-4 h-[3px] relative rounded right-[6px]'></div>
        <div className = 'bg-gray-600 w-4 h-[3px] relative rounded right-[6px]'></div>
        
      </div>
      <div className = 'bg-zinc-100 border-zinc-800 dark:border-zinc-600 dark:text-black text-sm w-full flex justify-between' style = {{background: color}}>
        <span className = 'p-5'>Notebook</span>
        <div className = 'flex h-full'>
          <div className = 'bg-zinc-200 dark:bg-zinc-900 w-1'></div>
          <div className = 'bg-zinc-100 w-1 dark:bg-zinc-800'></div>
        </div>
      </div>
    </Link>
    
  )
}

export default NotebookTab