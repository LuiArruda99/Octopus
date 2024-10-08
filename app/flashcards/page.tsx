"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "../lib/axios";

import Form from "../components/forms/Form";
import Logo from "../components/title/Logo";
import Flashcards from "../components/flashcards/Flashcards";
import { revalidateTag } from "next/cache";

interface formDataProps {
  educationLevel: string;
  subject: string;
  content: string;
}

interface FlashcardProps {
  question: string;
  answer: string;
}

const FlashcardsPage = () => {
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardProps[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [data, setData] = useState<formDataProps | undefined>();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analytics/total`, {
          next: {
            tags: ['flashcardCount'],
          }
        });
        const data = await response.json();
        const count = parseInt(data.totalUsage.flashcardCount) || 0;
        setFlashcardCount(count);
        setShowCount(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [router]);

  const handleFormSubmit = ({ educationLevel, subject, content }: formDataProps) => {
    const prompt = `
      Crie 12 flashcards numerados para a disciplina de ${subject} para um estudante do ${educationLevel}, abrangendo os seguintes tópicos: 
      
      ${content}

      Os flashcards devem seguir o formato:
      1-pergunta|resposta
      2-pergunta|resposta
      3-pergunta|resposta
      ...
      Utilize um separador "|" entre a pergunta e a resposta.

      Mantenha as perguntas e respostas concisas e informativas.
      
      Lembre-se de:
      Adaptar o nível de dificuldade ao ${educationLevel}.
      Fornecer respostas precisas e relevantes.
      
      Exemplo:
      Prompt: Crie 3 flashcards numerados para a disciplina de história para um estudante do ensino médio, abrangendo os seguintes tópicos: Segunda Guerra Mundial
      Resposta:
      1-Em que data terminou a Segunda Guerra Mundial?|2 de setembro de 1945
      2-Quais países formavam os Aliados na Segunda Guerra Mundial?|Reino Unido, França, União Soviética e Estados Unidos
      3-Quais países formavam o Eixo na Segunda Guerra Mundial?|Alemanha, Itália e Japão
      
      Observação: A resposta deve conter apenas os flashcards numerados, sem repetir o prompt. A resposta não deve ser uma lista com marcadores."
    `;
    setData({
      educationLevel,
      subject,
      content,
    })

    api.post('/gemini/', { prompt: prompt }).then(response => {
      setFlashcards(() => {
        const flashcardList = response.data.generatedContent.split("\n").map((flashcard: string) => {
          let [question, answer] = flashcard.split("|");
          question = question.split('-')[1];
          return { question, answer };
        });
        return flashcardList;
      });

      const createdFlashcards = response.data.generatedContent.split('\n').length;
      setIsGenerated(true);
      api.post('/analytics/', {
        type: 'flashcardCount',
        count: createdFlashcards,
        tokenInfo: response.data.tokenInfo
      });
      setFlashcardCount(prevFlashcardCount => prevFlashcardCount + createdFlashcards);
      revalidateTag('flashcardCount');
    }).catch((error: Error) => {
      console.error(error);
    }); 
  };

  return (
    <>
      <main className="p-8 lg:py-1 lg:px-24">
        <div className="flex flex-col items-center gap-8">
          <Logo />
          {
            isGenerated ? (
              <div className="flex flex-col justify-center items-center">
                <Flashcards flashcards={flashcards} />
                <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-16 lg:gap-24 mt-6">
                  <button
                    className="text-white hover:underline"
                    onClick={() => setIsGenerated(false)}
                  >
                    Gerar mais flashcards
                  </button>

                  {/* <button
                    className="text-white hover:underline"
                  >
                    Exportar flashcards para o Anki
                  </button> */}
                </div>
              </div>
            ) : (
              <Form name={"flashcards"} onSubmit={handleFormSubmit} />
            )
          }
        </div>
      </main>
      
      <div className="flex justify-center text-center text-white py-4">
        O Octopus já gerou 
        <div className="mx-1.5 text-blue-600 underline">
          {showCount ? flashcardCount : (
          <Image
            src={"/dot_loading.svg"}
            alt="Loading"
            width={20}
            height={20}
            className="mt-1.5"
          />
          )}
        </div> 
        flashcards!
      </div>
    </>
  );
}

export default FlashcardsPage;