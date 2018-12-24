// converts Binary result to hex
export default result =>
  result.recordset[0]['']
    && result.recordset[0]['']
      .toString('hex')
      .toUpperCase()
