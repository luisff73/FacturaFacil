export function validateNIF(nif: string): boolean {
  // Limpiamos espacios y pasamos a mayúsculas
  const value = nif.trim().toUpperCase();
  
  // Soporte para NIE (X, Y, Z)
  let cleanValue = value;
  if (cleanValue.startsWith('X')) cleanValue = cleanValue.replace('X', '0');
  else if (cleanValue.startsWith('Y')) cleanValue = cleanValue.replace('Y', '1');
  else if (cleanValue.startsWith('Z')) cleanValue = cleanValue.replace('Z', '2');

  const nifRegex = /^\d{8}[A-Z]$/;
  if (!nifRegex.test(cleanValue)) return false;

  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const numero = parseInt(cleanValue.substring(0, 8), 10);
  const letraCorrecta = letras[numero % 23];

  return cleanValue[8] === letraCorrecta;
}

export function validateCIF(cif: string): boolean {
  const value = cif.trim().toUpperCase();
  const cifRegex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/;
  if (!cifRegex.test(value)) return false;

  const control = value[value.length - 1];
  const digits = value.substring(1, value.length - 1);

  let sumaPar = 0;
  let sumaImpar = 0;

  for (let i = 0; i < digits.length; i++) {
    const n = parseInt(digits[i], 10);

    if (i % 2 === 0) {
      let mult = n * 2;
      if (mult > 9) mult -= 9;
      sumaImpar += mult;
    } else {
      sumaPar += n;
    }
  }

  const total = sumaPar + sumaImpar;
  const unidad = total % 10;
  const controlNum = unidad === 0 ? 0 : 10 - unidad;

  const letras = "JABCDEFGHI";
  const controlLetra = letras[controlNum];

  const tipo = value[0];

  if ("PQRSNW".includes(tipo)) {
    return control === controlLetra;
  } else if ("ABEH".includes(tipo)) {
    return control === String(controlNum);
  } else {
    return control === String(controlNum) || control === controlLetra;
  }
}

export function validateDocument(doc: string): boolean {
  if (!doc) return false;
  const value = doc.trim().toUpperCase();

  return validateNIF(value) || validateCIF(value);
}