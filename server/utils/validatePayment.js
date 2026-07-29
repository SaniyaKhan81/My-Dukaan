const PK_MOBILE = /^03\d{9}$/;

export const luhnCheck = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
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
  const expiryDate = new Date(year, month);
  return expiryDate > new Date();
};

export const validatePaymentDetails = (method, details) => {
  const errors = [];

  if (method === 'jazzcash' || method === 'easypaisa') {
    const mobile = (details.mobileNumber || '').replace(/\D/g, '');
    if (!PK_MOBILE.test(mobile)) {
      errors.push('Enter a valid Pakistani mobile number (03XX-XXXXXXX)');
    }
    if (!details.accountName || details.accountName.trim().length < 3) {
      errors.push('Enter the account holder name (as registered on wallet)');
    }
    if (!/^\d{4,6}$/.test(details.walletPin || '')) {
      errors.push('Wallet PIN must be 4–6 digits');
    }
    if (!details.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.push('Enter a valid email address');
    }
  }

  if (method === 'card') {
    const name = (details.cardholderName || '').trim();
    if (name.length < 3 || !/^[a-zA-Z\s.]+$/.test(name)) {
      errors.push('Enter cardholder name as shown on card');
    }
    const cardNumber = (details.cardNumber || '').replace(/\D/g, '');
    if (!luhnCheck(cardNumber)) {
      errors.push('Invalid card number');
    }
    if (!isExpiryValid(details.expiryDate || '')) {
      errors.push('Card expiry must be a valid future date (MM/YY)');
    }
    if (!/^\d{3,4}$/.test(details.cvv || '')) {
      errors.push('CVV must be 3 or 4 digits');
    }
  }

  return { valid: errors.length === 0, errors };
};

export const buildPaymentRef = (method, details) => {
  if (method === 'card') {
    const last4 = details.cardNumber.replace(/\D/g, '').slice(-4);
    return `CARD-${last4}`;
  }
  const mobile = details.mobileNumber.replace(/\D/g, '');
  return `${method.toUpperCase()}-${mobile}`;
};
