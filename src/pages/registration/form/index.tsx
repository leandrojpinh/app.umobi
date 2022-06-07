import { Button } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import { Layout } from "@/components/common/Layout"
import { Radio } from "@/components/common/Radio";
import { Title } from "@/components/common/Title"
import { Topic } from "@/components/common/Topic"
import { FORM_SIMPLE_FIELDS, FORM_COMPLEX_FIELDS } from "@/constants/FormFields";

import { FormEvent, InputHTMLAttributes, useState } from "react";

type IRegistrationProps = {
  email: string;
  name: string;
  birthDate: Date;
  address: string;
  phoneNumber: string;
  parentNames: string;
  churchName: string;
  ministerApproval: boolean;
  ministerNumber: string;
  isAllergic: boolean;
  medicineName: string;
  canSwim: boolean;
  isBeliever: boolean;
  isResponsable: boolean;
  moreInformation: string;
  isAllTrue: boolean;
}

export default function Registration() {
  const INITIAL_STATE: IRegistrationProps = {
    address: "",
    birthDate: new Date(),
    canSwim: false,
    churchName: '',
    email: '',
    isAllTrue: false,
    isAllergic: false,
    isBeliever: false,
    isResponsable: false,
    medicineName: '',
    ministerApproval: false,
    ministerNumber: '',
    moreInformation: '',
    name: "",
    parentNames: '',
    phoneNumber: '',
  };

  const [registration, setRegistration] = useState<IRegistrationProps>(INITIAL_STATE);

  const changeField = (field: string, value: any) => {
    console.log('field', { field, value });
    const newRegistration = {
      ...registration,
      [field]: value
    } as IRegistrationProps;
    console.log('newRegistration', newRegistration);
    setRegistration(newRegistration);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log('registration', registration);
  }

  return (
    <Layout>
      <Title
        title="Inscrição"
        subtitle="*Obs: idade mínima para participar é de 14 anos" />

      <section>
        <Topic title="Formulário" />

        <form onSubmit={handleSubmit}>
          {FORM_SIMPLE_FIELDS.map(({ field, id, type }) => {
            if (type === 'date') {
              const value = registration?.[field.name as keyof IRegistrationProps];
              return (
                <Input
                  key={id}
                  label={field.label}
                  name={field.name}
                  required={field.required}
                  value={value as keyof InputHTMLAttributes<HTMLInputElement>}
                  onChange={e => changeField(field.name, e.target.value)} />
              )
            }

            const value = registration?.[field.name as keyof IRegistrationProps];
            return (
              <Input
                key={id}
                label={field.label}
                name={field.name}
                required={field.required}
                onChange={e => changeField(field.name, e.target.value)}
                value={value as keyof InputHTMLAttributes<HTMLInputElement>}
              />
            )
          }
          )}

          <Radio
            key={FORM_COMPLEX_FIELDS.ministerApproval.id}
            label={FORM_COMPLEX_FIELDS.ministerApproval.field.label}
            options={FORM_COMPLEX_FIELDS.ministerApproval.options}
            name={FORM_COMPLEX_FIELDS.ministerApproval.field.name}
            subLabel={FORM_COMPLEX_FIELDS.ministerApproval.field.subLabel}
            onChange={e => {
              changeField(FORM_COMPLEX_FIELDS.ministerApproval.field.name, e.target.value === '1')
            }}
          />

          <Radio
            key={FORM_COMPLEX_FIELDS.isAllergic.id}
            label={FORM_COMPLEX_FIELDS.isAllergic.field.label}
            options={FORM_COMPLEX_FIELDS.isAllergic.options}
            name={FORM_COMPLEX_FIELDS.isAllergic.field.name}
            subLabel={FORM_COMPLEX_FIELDS.isAllergic.field.subLabel}
            onChange={e => changeField(FORM_COMPLEX_FIELDS.isAllergic.field.name, e.target.value === '1')}
          />

          {
            registration?.isAllergic && (
              <Input
                key={FORM_COMPLEX_FIELDS.medicineName.id}
                label={FORM_COMPLEX_FIELDS.medicineName.field.label}
                name={FORM_COMPLEX_FIELDS.medicineName.field.name}
                value={registration?.medicineName}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.medicineName.field.name, e.target.value)}

              />
            )
          }

          <Radio
            key={FORM_COMPLEX_FIELDS.canSwim.id}
            label={FORM_COMPLEX_FIELDS.canSwim.field.label}
            options={FORM_COMPLEX_FIELDS.canSwim.options}
            name={FORM_COMPLEX_FIELDS.canSwim.field.name}
            onChange={e => changeField(FORM_COMPLEX_FIELDS.canSwim.field.name, e.target.value === '1')}
          />

          <Radio
            key={FORM_COMPLEX_FIELDS.isBeliever.id}
            label={FORM_COMPLEX_FIELDS.isBeliever.field.label}
            options={FORM_COMPLEX_FIELDS.isBeliever.options}
            name={FORM_COMPLEX_FIELDS.isBeliever.field.name}
            onChange={e => changeField(FORM_COMPLEX_FIELDS.isBeliever.field.name, e.target.value === '1')}
          />

          <Radio
            key={FORM_COMPLEX_FIELDS.isResponsable.id}
            label={FORM_COMPLEX_FIELDS.isResponsable.field.label}
            options={FORM_COMPLEX_FIELDS.isResponsable.options}
            name={FORM_COMPLEX_FIELDS.isResponsable.field.name}
            required={FORM_COMPLEX_FIELDS.isResponsable.field.required}
            onChange={e => changeField(FORM_COMPLEX_FIELDS.isResponsable.field.name, e.target.value === '1')}
          />

          <Input
            key={FORM_COMPLEX_FIELDS.moreInformation.id}
            label={FORM_COMPLEX_FIELDS.moreInformation.field.label}
            name={FORM_COMPLEX_FIELDS.moreInformation.field.name}
            value={registration?.moreInformation}
            onChange={e => changeField(FORM_COMPLEX_FIELDS.moreInformation.field.name, e.target.value)}
          />

          <Checkbox
            key={FORM_COMPLEX_FIELDS.isAllTrue.id}
            label={FORM_COMPLEX_FIELDS.isAllTrue.field.label}
            required={FORM_COMPLEX_FIELDS.isAllTrue.field.required}
            onChange={e => changeField(FORM_COMPLEX_FIELDS.isAllTrue.field.name, e.target.checked)}
          />

          <Button type={'submit'} label="Continuar" onClick={() => { }} />
        </form>
      </section>
    </Layout>
  )
}