import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="flex flex-col justify-center md:justify-start">
      <h1 className="flex text-6xl md:text-7xl lg:text-8xl font-bold mb-2 text-transparent text-8xl bg-clip-text bg-gradient-to-r from-blue-600 to-rose-400">
          Octopus
      </h1>
      <p className="flex justify-end text-sm md:text-base text-stone-700 lg:text-lg gap-1">
        Powered by Martin
        <Image 
          src={"/gemini_sparkle.svg"} 
          alt={"Gemini Sparkle"}
          width="0"
          height="0"
          className="w-[10px] h-auto"
        />
      </p>
    </Link>
  );
}

export default Logo;