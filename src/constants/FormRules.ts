export interface FormRole {
    description: string;
    options?: string[];
  }
  
  export interface FormProps {
    id: number;
    name: string;
    items: FormRole[];
  }
  
  export const FORM: FormProps[] = [
    {
      id: 1,
      name: "1. Regras Gerais",
      items: [
        {
          description: "1.1 Não será permitido:",
          options: [
            "A) sair do acampamento sem autorização;",
            "B) desrespeitar qualquer retirante no ato de suas atribuições;",
            "C) o uso ou transporte de qualquer tipo de droga lícita ou ilícita;",
            "D) o uso de fones de ouvido durante as programações, como também ouvir músicas não evangélicas ou até mesmo músicas evangélicas que fujam dos padrões de culto de nossas igrejas;",
            "E) o uso de notebook, especialmente com filmes seculares que possam ferir os propósitos de nossa programação.",
            "",
          ],
        },
        {
          description:
            "1.2 Brincadeiras e conversas são permitidas, mas o limite é o outro, ou seja, se alguém estiver sendo prejudicado pediremos que parem. Não será permitido a brincadeira de pintar o rosto de pasta, tinta etc.",
        },
        {
          description:
            "1.3 A limpeza dos banheiros e do espaço dentro e fora do dormitório será de responsabilidade dos retirantes.",
        },
      ],
    },
    {
      id: 2,
      name: "2. REGRAS PARA NAMORO",
      items: [
        {
          description: "2.1 Não será permitido:",
          options: [
            "A) a saída de casais para lugares escuros, sozinhos ou acompanhados (isso é para todos).",
            "B) excesso de carinhos como beijos, abraços e caricias, em nenhum lugar do acampamento.",
          ],
        },
      ],
    },
    {
      id: 3,
      name: "3. REGRAS DE USO DE PISCINAS E ROUPAS APROPRIADAS PARA AS PROGRAMAÇÕES",
      items: [
        {
          description: "3.1 Antes de entrar na piscina, passe pelo chuveiro.",
        },
        {
          description:
            "3.2 Use roupas apropriadas (evite jeans e roupas que soltem tintas).",
        },
        {
          description: "3.3 Não comer dentro ou nas bordas da piscina.",
        },
        {
          description: "3.4 Roupas permitidas na piscina:",
          options: [
            "A) moças: maiô decente com short, caso não tenha maiô ou que não esteja descente, pediremos que coloque uma blusa escura por cima.",
            "B) rapazes: calção escuro não colado e camiseta.",
          ],
        },
        {
          description: "3.5 Roupas permitidas nas programações de culto:",
          options: [
            "A) moças: saia, calça, vestido, camisas normais. Pedimos que não use blusas de alcinha, roupas transparentes, curtas e qualquer item muito colado.",
            "B) rapazes: calça, camisas, blusas, tênis e chinelos. Não usar camisetas e roupas coladas, ou que possam expor peças íntimas.",
          ],
        },
        {
          description: "3.6 Roupas permitidas nas dinâmicas",
          options: [
            "A) moças: se usar legging, devem vestir uma blusa comprida.",
            "B) rapazes: shorts e blusas.",
          ],
        },
      ],
    },
    {
      id: 4,
      name: "4. PREVENÇÃO À COVID-19",
      items: [
        {
          description: '4.1 Se você se inscreveu, mas testou positivo para Covid-19 próximo à data ou no dia do retiro, por favor, fique em casa. Se já tiver realizado o pagamento, nesse caso específico, será devolvido o valor pago.',
        },
        {
          description: '4.2 Cumprindo exigências ainda em vigor faz-se necessário o uso de máscara nas programações.',
        },
        {
          description: '4.3 Orientamos que todos façam uso regular de álcool em gel.',
        }
      ]
    },
    {
      id: 5,
      name: "5. PENALIDADES",
      items: [
        {
          description: '5.1 Penalidade simples: O retirante será direcionado a fazer alguma tarefa e sua equipe não sofrerá penalidade nos pontos;',
        },
        {
          description: '5.2 Penalidade de nível médio: O retirante será direcionado a fazer alguma atividade, sofrerá penalidade nos pontos da equipe e estará sobre aviso, caso aconteça novamente receberá a penalidade máxima;',
        },
        {
          description: '5.3 Penalidade de nível máximo: O retirante será deixado em sua residência sem direito a devolução do dinheiro, e será suspenso de participar dos dois retiros seguintes.',
        },
        {
          description: 'OBS: Os responsáveis para julgar e aplicar a penalidades serão os pastores presentes no retiro.'
        }
      ]
    },
  ];
  