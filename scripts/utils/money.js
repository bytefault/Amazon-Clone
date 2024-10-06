export function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

// . to fixed method giving sometimes wrong ans for the no ending with 5, we get to know using ai, so we can fix this issue if we round of the no. first so that this method doesn't have to do the rounding
//6.005.toFixed(2)=> '6.00' XXXXXX
//7.005.toFixed(2)=> '7.00' XXXXXX
//8.005.toFixed(2)=> '8.01' correct
