new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
}).format(222.1234); //222,123 ₫
