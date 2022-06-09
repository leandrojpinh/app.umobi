import { Button } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout";
import { Title } from "@/components/common/Title";
import { Topic } from "@/components/common/Topic";

import { FormEvent, useState } from "react";

import { FileContainer } from '@/styles/pages/Payments';

import styles from '@/styles/payment.module.scss';
import { FiLayers, FiPaperclip } from "react-icons/fi";

import { IResponseProps, Response } from '@/components/common/Response';

export default function Payment() {
  const [file, setFile] = useState<File>();
  const [response, setResponse] = useState<IResponseProps>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setResponse({
      title: 'tudo certo!',
      message: 'Abaixo o código para acessar sua inscrição, não se preocupe, enviamos pora o seu e-mail também, verifica lá e não perca esse código.',
      type: 'success'
    })
  }

  const handleFile = (fileSelected?: File) => {
    if (fileSelected) {
      setFile(fileSelected);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText("textToCopy");
  }

  return (
    <Layout>
      {response ? (
        <Response type={response.type} message={response.message} title={response.title} />
      ) : (
        <>
          <Title
            title="Inscrição"
            subtitle="*Obs: idade mínima para participar é de 14 anos" />

          <section>
            <Topic title="Comprovante de Pagamento" />

            <div className={styles.info}>
              <span>Taxa do Retiro</span>
              <strong className={styles.tax}>R$ 300,00</strong>

              <span>Dados para envio de pix/transferências</span>
              <span>Chave Pix</span>
              <div className={styles.pix}>
                <span>
                  654654654564654
                </span>
                <button onClick={handleCopy}>Copiar <FiLayers height={18} color={'var(--primary-light)'} /></button>
              </div>

              <span>Banco: Nome do banco</span>
              <span>Tesoureiro: Nome da pessoa</span>
            </div>

            <form onSubmit={handleSubmit}>
              <FileContainer>
                <input type="file" accept="image/*,application/pdf" onChange={(e) => { handleFile(e.target.files ? e.target.files[0] : undefined) }} required />

                <div>
                  <FiPaperclip height={18} color={'var(--primary-dark)'} />
                  {!file ? <span>Selecione o arquivo</span> : <span>{file.name}</span>}
                </div>
              </FileContainer>


              <Button type={'submit'} label="Finalizar" onClick={() => { }} />
            </form>
          </section>
        </>
      )}
    </Layout>
  )
}