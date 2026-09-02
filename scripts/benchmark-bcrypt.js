import bcrypt from 'bcryptjs';

console.log('--- BCRYPT HARDWARE BENCHMARK ---');
const pw = 'KodranAdmin2026!SecurePassphrase';
for (const rounds of [10, 11, 12]) {
  const t0 = performance.now();
  const hash = bcrypt.hashSync(pw, rounds);
  const hashTime = (performance.now() - t0).toFixed(2);

  const t1 = performance.now();
  const isMatch = bcrypt.compareSync(pw, hash);
  const compTime = (performance.now() - t1).toFixed(2);

  console.log('Bcrypt Cost ' + rounds + ': Hash=' + hashTime + 'ms, Compare=' + compTime + 'ms, Valid=' + isMatch);
}
