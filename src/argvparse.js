export default (argv, arg) => {
  const argk = `--${arg}`
  const argkv = argv.find(arg => arg.startsWith(argk))

  // '--i=/home/package.json' => /home/package.json
  return argkv && argkv.slice(argk.length + 1)
}
