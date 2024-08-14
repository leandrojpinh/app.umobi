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

export interface UmobiCodeProps {
  name?: string;
  code?: string;
  email?: string;
}

export const UmobiCode = ({ name, code }: UmobiCodeProps) => (
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
          <Heading className="text-xl my-8">Código de alteração de senha!</Heading>
          <Text className="py-4 mt-8">
            Olá {name}, segue abaixo o código para alteração de senha.
          </Text>
          <Text>
            <code className="p-4 bg-[#13181F] rounded-md">{code}</code>
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

export default UmobiCode;