import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Radio } from "@/components/common/Radio";
import { PAYMENT_FIELDS } from "@/constants/FormFields";
import { IPaymentProps } from "@/pages/registration";
import { FileContainer } from "@/styles/pages/Payments";
import { FormEvent } from "react";
import { FiPaperclip } from "react-icons/fi";

type PaymentFormProps = {
    file?: File,
    payment: IPaymentProps,
    onPaymentChange: (field: string, value: any) => void,
    onFileChange: (file: File) => void,
    submit: (e: FormEvent) => void,
}

export const PaymentForm = (props: PaymentFormProps) => {
    return (
        <form onSubmit={props.submit}>
            <Radio
                key={PAYMENT_FIELDS.paymentMode.id}
                label={PAYMENT_FIELDS.paymentMode.field.label}
                options={PAYMENT_FIELDS.paymentMode.options.filter(f => !['1x'].includes(f.value))}
                name={PAYMENT_FIELDS.paymentMode.field.name}
                subLabel={PAYMENT_FIELDS.paymentMode.field.subLabel}
                selected={props.payment.paymentMode}
                onChange={(e) => props.onPaymentChange(PAYMENT_FIELDS.paymentMode.field.name, e.target.value)}
            />
            <FileContainer>
                <input type="file" accept="image/*,application/pdf" onChange={(e) => { props.onFileChange(e.target.files![0]) } } required />

                <div>
                    <FiPaperclip height={18} color={'var(--text)'} />
                    {!props.file ? <span>Selecione o arquivo</span> : <span>{props.file.name}</span>}
                </div>
            </FileContainer>

            <Input
                key={PAYMENT_FIELDS.tax.id}
                label={PAYMENT_FIELDS.tax.field.label}
                name={PAYMENT_FIELDS.tax.field.name}
                type={PAYMENT_FIELDS.tax.type}
                value={props.payment.tax}
                onChange={(e) => props.onPaymentChange(PAYMENT_FIELDS.paymentMode.field.name, e.target.value)}
            />

            <Button type={'submit'} label="Finalizar" disabled={!props.file || (!props.payment.tax)} />
        </form>
    )
}