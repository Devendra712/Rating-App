
const bcrypt = require('bcryptjs');

const plainPassword = 'admin'; // ← changing  new password

bcrypt.hash(plainPassword, 10).then(hash => {
  console.log('Your bcrypt hash:', hash);
});
