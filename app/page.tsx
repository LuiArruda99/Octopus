import Image from "next/image";

import OptionBox from "./components/buttons/OptionBox";

export default function Home() {
  return (
    <main className="px-8 p-16 lg:p-20">
      <div className="flex justify-center">
        <div className="flex flex-col justify-center md:justify-start mb-8">
          <h1 className="flex text-6xl md:text-7xl lg:text-8xl font-bold mb-2 text-transparent text-8xl bg-clip-text bg-gradient-to-r from-blue-600 to-rose-400 ">
            Octopus
          </h1>
          <p className="flex justify-end text-sm md:text-base text-stone-700 lg:text-lg gap-1">
            Powered by Martin
            <Image 
              src={"/gemini_sparkle.svg"} 
              alt={"Gemini Sparkle"}
              width="0"
              height="0"
              className="w-[20px] h-auto"
            />
          </p>
        </div>
      </div>
      <div className="lg:mx-30 flex text-3xl md:text-5xl lg:text-6xl font-semibold text-stone-600 mb-6 md:mb-10 lg:mb-12 pb-4 md:pb-6 border-b-4">
        Olá, <br />
        Vou te ajudar a estudar!
      </div>
      <div className="text-xl md:text-2xl text-center lg:text-3xl mb-6 lg:mb-10 text-gray-400 font-semibold">
        Posso ajudar? 
      </div>
      <div className="flex flex-wrap justify-center gap-6 lg:gap-16">
        <OptionBox title={"Flashcards"} icon={"flashcard.svg"} link={"/flashcards"}/>
        <OptionBox title={"Resumos"} icon={"resumo.svg"} link={"/summary"}/>
        <OptionBox title={"Listas de Exercícios"} icon={"lista.svg"} link={"/exercises"}/>
      </div>
    </main>
  );
}
