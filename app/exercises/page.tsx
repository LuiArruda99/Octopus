"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import { api } from "../lib/axios";

import Form from "../components/forms/Form";
import Logo from "../components/title/Logo";
import { revalidateTag } from "next/cache";

interface formDataProps {
  educationLevel: string;
  subject: string;
  content: string;
}

const ExercisesPage = () => {
  const [exerciseCount, setExerciseCount] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const [exercises, setExercises] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [data, setData] = useState<formDataProps | undefined>();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analytics/total`, {
          next: {
            tags: ['exerciseCount'],
          }
        });
        const data = await response.json();
        const count = parseInt(data.totalUsage.exerciseCount) || 0;
        setExerciseCount(count);
        setShowCount(true);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [router]);

  const handleFormSubmit = async ({ educationLevel, subject, content }: formDataProps) => {
    const prompt = `
      Crie uma lista de exercícios de ${subject} para um estudante do ${educationLevel}. 

      Os exercícios devem abranger os seguintes tópicos:

      ${content}

      A lista de exercícios deve conter 10 questões de múltipla escolha, com 5 alternativas cada (onde apenas uma alternativa deverá ser a correta). Além disso, a lista deve conter uma questão desafio extra com nível de dificuldade um pouco maior do que as demais.

      Ao final da lista, adicione um gabarito com as respostas corretas e justificativas para cada questão.

      O Título deve ser "Lista de exercícios de ${subject} - ${educationLevel}".

      A lista deve ser numerada.
    `;
    setData({
      educationLevel,
      subject,
      content,
    });

    api.post('/gemini/', { prompt: prompt }).then(response => {
      setExercises(response.data.generatedContent);
      setIsGenerated(true);
      api.post('/analytics/', { 
        type: 'exerciseCount', 
        count: 1, 
        tokenInfo: response.data.tokenInfo
      });
      setExerciseCount(prevExerciseCount => prevExerciseCount + 1);
      revalidateTag('exerciseCount');
    }).catch((error: Error) => {
      console.error(error);
    });
  };

  return (
    <>
      <main className="p-4 md:p-8 lg:py-12 lg:px-24">
        <div className="flex flex-col items-center gap-8">
          <Logo />
          {
            isGenerated ? (
              <div className="py-6 px-8 w-auto bg-zinc-300 rounded-lg border-1 border-gray-200 shadow-lg">
                <Markdown className="prose lg:prose-lg" children={exercises} />
                <div className="mt-2 pt-6 border-t-2 border-gray-300 flex flex-col items-start">
                  <button
                    onClick={() => setIsGenerated(false)}
                    className="text-blue-500 hover:text-blue-700 mb-2 hover:underline"
                  >
                    Gerar nova lista de exercícios
                  </button>
                  <Link href={"/"} className="text-blue-500 hover:text-blue-700 hover:underline">
                    Voltar ao início
                  </Link>
                
                </div>
              </div>
            ) : (
              <Form name={"lista de exercícios"} onSubmit={handleFormSubmit} />
            )
          }
        </div>
      </main>
      <div className="flex justify-center text-center text-white py-4">
        O Octopus já gerou 
        <div className="mx-1.5 text-blue-600 underline">
          {showCount ? exerciseCount : (
            <Image
              src={"/dot_loading.svg"}
              alt="Loading"
              width={20}
              height={20}
              className="mt-1.5"
            />
          )}
        </div> 
        listas de exercícios!
      </div>
    </>
  );
}

export default ExercisesPage;