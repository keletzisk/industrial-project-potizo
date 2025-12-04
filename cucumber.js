const config = {
  requireModule: ['ts-node/register'],
  require: ['features/**/*.ts'],
  format: ['summary', 'progress-bar', 'html:cucumber-report.html'],
  formatOptions: { snippetInterface: 'async-await' },
}

module.exports = {
  default: config
}
