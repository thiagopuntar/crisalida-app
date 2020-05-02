export const formatCurrency = (number) => {
  if (!number)
    return '0.00'

  const floatNumber = parseFloat(number);

  return `R$ ${floatNumber.toFixed(2)}`;
}