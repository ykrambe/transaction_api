function generateInvoiceNumber(prefix: string = "INV"): string {
  const timestamp = Date.now().toString(); // Mendapatkan timestamp saat ini
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString(); // Angka acak 4 digit
  return `${prefix}-${timestamp}-${randomSuffix}`;
}

export {generateInvoiceNumber}