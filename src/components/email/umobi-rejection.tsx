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

export interface UmobiRejectionProps {
  email?: string;
  name?: string;
  eventName?: string;
}

export const UmobiRejection = ({ name, eventName }: UmobiRejectionProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="my-12 max-auto font-sans bg-[#252C3D] text-[#FFFFFF]">
        <Container className="mx-0 my-auto px-8 pb-8 py-0">
          <Img
            src={'https://www.umobice.com.br/umobi-logo.png'}
            width="w-24"
            height="auto"
            alt="Linear"
          />
          <Heading className="text-xl my-8">Comprovante rejeitado!</Heading>
          <Text className="py-4 mt-8">
            Olá {name}, verificamos que o comprovante enviado para o evento {eventName} não está correto, verifique e reenvie novamente.
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

export default UmobiRejection;