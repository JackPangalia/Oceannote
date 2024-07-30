import IconPlus from "./icons/IconPlus";

const CreateNoteButton = ({ onClick }) => {
  return (
    <div className="py-[13.5px] px-[13.6px] dark:bg-darkMode bg-lightMode border-zinc-800 hover:bg-zinc-200 transition-all duration-200 border-[1px] gap-3 flex items-center mt-2 rounded shadow-md">
      <button
        className="dark:hover:text-white hover:text-black"
        onClick={onClick}
      >
        <IconPlus />
      </button>
    </div>
  );
};

export default CreateNoteButton;