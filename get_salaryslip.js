const fs = require('fs');
fs.writeFileSync('salary_slip_copy.txt', fs.readFileSync('src/components/SalarySlip.tsx', 'utf8'));
