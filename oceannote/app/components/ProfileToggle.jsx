import IconInformationCircleOutline from "./icons/IconInformationCircleOutline";
import Link from "next/link";

const ProfileToggle = () => {
  return (
    <div className =  'flex flex-col gap-2'>
      <h2 className="text-xl">Profile</h2>
      <p className="flex items-center gap-2 text-gray-500 mt-2 border-b-[1px] border-gray-300 pb-4">
        <IconInformationCircleOutline /> You are using google to sign in so much
        of your information is predefined
      </p>
    
      {/* <p className = 'bg-lightMode w-fit px-2 py-1'>username</p> */}
      <div className = 'flex flex-col gap-2 mt-3'>
        <Link href = '/signup' className = 'hover:bg-zinc-200 dark:hover:bg-zinc-800 bg-lightMode dark:bg-darkMode py-2 px-4 rounded-md w-fit border-zinc-800 dark:border-zinc-500 shadow border-[1px] transition-colors duration-150'>Logout</Link>
        <button className = 'hover:bg-red-300 dark:hover:bg-red-300 dark:hover:text-black dark:hover:border-zinc-800 bg-lightMode dark:bg-darkMode py-2 px-4 rounded-md w-fit border-zinc-800 dark:border-zinc-500 shadow border-[1px] transition-colors duration-150'>Delete Account</button>
      </div>
    </div>
  );
};

export default ProfileToggle;
