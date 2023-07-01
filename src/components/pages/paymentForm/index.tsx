import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Radio } from "@/components/common/Radio";
import { PAYMENT_FIELDS } from "@/constants/FormFields";
import { IPaymentProps } from "@/pages/registration";
import { FileContainer } from "@/styles/pages/Payments";
import { FormEvent } from "react";
import { FiPaperclip } from "react-icons/fi";

import { paymentFormModule as styles } from "@/styles/components/pages";
import { RegistrationPayment } from "@/services/umobi/models/Registration";

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
        <form className={styles.container} onSubmit={(e) => props.submit(e)}>
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
                <input type="file" accept="image/*,application/pdf" onChange={(e) => {
                    if (!e.target.files) return;

                    props.onFileChange(e.target.files[0]);
                }} />

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
                onChange={(e) => props.onPaymentChange(PAYMENT_FIELDS.tax.field.name, e.target.value)}
            />

            {props.error && (
                <div className={styles.error}>
                    <span>{props.error}</span>
                </div>
            )}

            <Button type={'submit'} label="Finalizar" disabled={!props.file || !props.payment.tax || !props.payment.paymentMode} />
        </form>
    )
}