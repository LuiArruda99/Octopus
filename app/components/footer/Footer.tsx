import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <Link href="https://github.com/LuiArruda99" target="_blank" className="cursor-pointer text-white flex justify-center mb-2 gap-1 group mx-auto">
      <Image
        src={"/github.svg"}
        alt="Github icon"
        width="0"
        height="0"
        className="w-[20px] h-auto"
      />
      <span className="group-hover:underline">Luiz Arruda</span> 
    </Link>
  );
}

export default Footer;