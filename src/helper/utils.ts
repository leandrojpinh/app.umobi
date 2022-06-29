export const toMoney = (value: string) => {
  const number = value ? Number(value) : 0;

  if(value === '') {
    return '';
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
}