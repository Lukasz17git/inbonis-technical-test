export function validateSpanishCif(cif: string): boolean {
   const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]{1}\d{7}[0-9A-J]$/;
   if (!cifRegex.test(cif)) return false;

   const controlDigit = cif.charAt(cif.length - 1);
   const digits = cif.substr(1, cif.length - 2);

   let sum = 0;
   let digit: number;
   for (let i = 0; i < digits.length; i++) {
      digit = parseInt(digits[i], 10);
      if (i % 2 === 0) {
         digit *= 2;
         if (digit > 9) {
            digit -= 9;
         }
      }
      sum += digit;
   }

   const lastDigit = 10 - (sum % 10);
   const lastChar = String.fromCharCode(lastDigit + 64);

   return (controlDigit === lastChar || controlDigit === lastDigit.toString());
}
