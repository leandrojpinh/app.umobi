import { FormEvent } from "react";
import { FiPaperclip } from "react-icons/fi";
import { toast } from "react-toastify";

import { RegistrationPayment } from "@/services/umobi/models/Registration";
import { Radio } from "@/components/ui/Radio";
import { Input } from "@/components/ui/Input";
import { PAYMENT_FIELDS } from "@/constants/FormFields";
import { Button } from "@/components/ui/Button";
import { FileContainer } from "../FileContainer";
import { IPaymentProps } from "@/app/(features)/registration/page";

type PaymentFormProps = {
  file?: File,
  payment: IPaymentProps,
  error?: string,
  payments: RegistrationPayment[],
  onPaymentChange: (field: string, value: any) => void,
  onFileChange: (file: File) => void,
  submit: (e: FormEvent) => void,
}

export const PaymentForm = (props: PaymentFormProps) => {
  const totalPaid = props.payments.filter(f => !f.rejected)?.reduce((acc, item) => acc + item.tax, 0);

  return (
    <form onSubmit={(e) => props.submit(e)}>
      <Radio
        key={PAYMENT_FIELDS.paymentMode.id}
        label={PAYMENT_FIELDS.paymentMode.field.label}
        options={totalPaid > 0 ? PAYMENT_FIELDS.paymentMode.lastOptions : PAYMENT_FIELDS.paymentMode.options}
        name={PAYMENT_FIELDS.paymentMode.field.name}
        subLabel={PAYMENT_FIELDS.paymentMode.field.subLabel}
        selected={props.payment.paymentMode}
        onChange={(e) => props.onPaymentChange(PAYMENT_FIELDS.paymentMode.field.name, e.target.value)}
      />
      <FileContainer>
        <input className="absolute m-0 p-0 w-full h-full outline-none opacity-0 cursor-pointer" type="file" accept="image/*,application/pdf" onChange={(e) => {
          if (!e.target.files) return;

          if (e.target.files && e.target.files[0].size > 1024 * 1024) {
            toast.warning('Arquivo muito grande, o tamanho máximo é 1MB!');
            return;
          }

          props.onFileChange(e.target.files[0]);
        }} />

        <div className="gap-2 flex text-app-text py-8 items-center justify-center">
          <FiPaperclip height={18} color={'var(--text)'} />
          {!props.file ? <span className="font-app-text">Selecione o arquivo</span> : <span className="font-app-text">{props.file.name}</span>}
        </div>
      </FileContainer>

      <Input
        key={PAYMENT_FIELDS.tax.id}
        label={PAYMENT_FIELDS.tax.field.label}
        name={PAYMENT_FIELDS.tax.field.name}
        type={PAYMENT_FIELDS.tax.type}
        value={props.payment.tax}
        onChange={(e) => props.onPaymentChange(PAYMENT_FIELDS.tax.field.name, e.target.value)}
      />

      {props.error && (
        <div className={'p-2 bg-app-error rounded-md text-sm'}>
          <span>{props.error}</span>
        </div>
      )}

      <Button type={'submit'} label="Finalizar" disabled={!props.file || !props.payment.tax || !props.payment.paymentMode} />
    </form>
  )
}