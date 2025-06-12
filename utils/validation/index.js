// utils/dateHelpers.js
function isValidDateYYYYMMDD(dateString) {
  // First check for the pattern
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  // Parse the date parts to integers
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (
    year < 1900 ||
    year > new Date().getFullYear() ||
    month == 0 ||
    month > 12
  ) {
    return false;
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    monthLength[1] = 29;
  }

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

function isAtLeast18YearsOld(dateString) {
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

function formatYupErrors(yupError) {
  if (!yupError.inner || yupError.inner.length === 0) {
    return [
      {
        field: yupError.path,
        message: yupError.message,
      },
    ];
  }

  return yupError.inner.map((error) => ({
    field: error.path,
    message: error.message,
  }));
}

module.exports = {
  isValidDateYYYYMMDD,
  isAtLeast18YearsOld,
  formatYupErrors,
};
