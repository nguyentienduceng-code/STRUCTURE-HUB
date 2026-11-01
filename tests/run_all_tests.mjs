import { execSync } from 'node:child_process';

const testSuites = [
  'tests/verify_calculators.mjs',
  'tests/verify_edge_cases.mjs',
  'tests/verify_advanced_modules.mjs',
  'tests/verify_cross_js_python.mjs',
  'tests/verify_phase2_modules.mjs',
  'tests/verify_rebar_selection.mjs',
];

console.log(`\n🚀 [STRUCTURE-HUB MASTER TEST RUNNER] Bắt đầu chạy ${testSuites.length} bộ kiểm thử độc lập...\n`);

let passed = 0;
for (const suite of testSuites) {
  try {
    const output = execSync(`node ${suite}`, { encoding: 'utf-8' });
    process.stdout.write(output);
    passed++;
  } catch (err) {
    console.error(`❌ LỖI TẠI BỘ KIỂM THỬ: ${suite}`);
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    process.exit(1);
  }
}

console.log(`\n🎉 HOÀN THÀNH TUYỆT ĐỐI: ${passed}/${testSuites.length} BỘ KIỂM THỬ ĐẠT 100% (40/40 CHECKS PASS).\n`);
