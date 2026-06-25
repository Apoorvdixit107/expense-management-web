/** Splits a tax-inclusive total into taxable base and GST. */
export function splitInclusiveGst(totalAmount: number, ratePercent: number) {
  if (!totalAmount || totalAmount <= 0 || !ratePercent || ratePercent <= 0) {
    return { taxableAmount: totalAmount || 0, taxAmount: 0, totalAmount: totalAmount || 0 };
  }
  const taxAmount = Math.round(((totalAmount * ratePercent) / (100 + ratePercent)) * 100) / 100;
  const taxableAmount = Math.round((totalAmount - taxAmount) * 100) / 100;
  return { taxableAmount, taxAmount, totalAmount };
}
