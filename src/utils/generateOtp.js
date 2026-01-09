function generateOtp(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // 0-9 digits
  }
  return otp;
}

module.exports = { generateOtp };