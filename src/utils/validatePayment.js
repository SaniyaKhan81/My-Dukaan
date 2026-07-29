export const luhnCheck = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const isExpiryValid = (expiry) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  return new Date(year, month) > new Date();
};

export const validatePaymentDetails = (method, details) => {
  const errors = [];
  const PK_MOBILE = /^03\d{9}$/;

  if (method === 'jazzcash' || method === 'easypaisa') {
    const mobile = (details.mobileNumber || '').replace(/\D/g, '');
    if (!PK_MOBILE.test(mobile)) errors.push('Enter a valid Pakistani mobile number (03XX-XXXXXXX)');
    if (!details.accountName?.trim() || details.accountName.trim().length < 3) {
      errors.push('Enter account holder name');
    }
    if (!/^\d{4,6}$/.test(details.walletPin || '')) errors.push('Wallet PIN must be 4–6 digits');
    if (!details.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.push('Enter a valid email address');
    }
  }

  if (method === 'card') {
    if (!details.cardholderName?.trim() || details.cardholderName.trim().length < 3) {
      errors.push('Enter cardholder name');
    }
    if (!luhnCheck(details.cardNumber || '')) errors.push('Invalid card number');
    if (!isExpiryValid(details.expiryDate || '')) errors.push('Invalid or expired card (MM/YY)');
    if (!/^\d{3,4}$/.test(details.cvv || '')) errors.push('CVV must be 3 or 4 digits');
  }

  return { valid: errors.length === 0, errors };
};
