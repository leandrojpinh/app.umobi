import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Text,
  Tailwind
} from "@react-email/components";

export interface UmobiChargeProps {
  name?: string;
  email?: string;
  eventName?: string;
}

export const UmobiCharge = ({ name, eventName }: UmobiChargeProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="my-12 py-12 max-auto font-sans bg-[#252C3D] text-[#FFFFFF]">
        <Container className="mx-0 my-auto px-8 pb-8 py-0">
          <Img
            src={'https://www.umobice.com.br/umobi-logo.png'}
            width="w-24"
            height="auto"
            alt="Linear"
          />
          <Heading className="text-xl my-8">Lembrete!</Heading>
          <Text className="py-4 mt-8">
            Olá {name}, estamos lembrando que ainda não recebemos o comprovante da sua inscrição para o evento: {eventName}
          </Text>
          <Text className="py-4 mt-4">
            Caso já tenha enviado, só confirma com a secretaria da Umobi para garantir que está tudo certinho.
          </Text>
          <Hr className="divide-x mt-8" />
          <Link href="https://umobice.com.br" className="text-[#4646E9]">
            Umobi
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default UmobiCharge;