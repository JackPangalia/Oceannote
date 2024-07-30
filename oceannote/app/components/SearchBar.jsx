import IconBxSearchAlt from "./icons/IconBxSearchAlt";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="py-[10px] px-5 gap-3 dark:bg-darkMode text-gray-500 bg-lightMode border-zinc-800 transition-all duration-200 border-[1px] ml-5 mt-2 flex items-center rounded shadow-md">
      <button>
        <IconBxSearchAlt />
      </button>
      <input
        placeholder="Search all notes and tags"
        className="bg-transparent outline-none md:w-[22.5rem] w-full"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;