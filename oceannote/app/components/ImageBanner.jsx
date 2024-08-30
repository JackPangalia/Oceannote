import Image from "next/image";
import IconCardImage from "./icons/IconCardImage";

const ImageBanner = () => {
  return (
    <div>
      <button className = 'mb-2 dark:text-darkMode text-white absolute p-2'>
        <IconCardImage />
      </button>
      
      <Image
        width={1000}
        height={1000}
        alt="home-screen-banner-img"
        src="/yellow-turquoise-ink-stain-design-texture-backdrop.jpg"
        className="w-full h-[5rem] md:h-[7rem] mb-6 rounded-md object-cover"
      />
    </div>
  );
};

export default ImageBanner;
