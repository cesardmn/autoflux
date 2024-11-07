export const Logger = (() => {
  const log = {}

  const setLog = (actionName, log) => {
    log[actionName] = { log, stamp: Date.now() }
  }

  return {
    log,
    setLog,
  }
})()
