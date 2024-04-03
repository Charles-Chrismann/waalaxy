import winston from "winston";
const { combine, timestamp, printf, colorize, align } = winston.format

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2
  },
  transports: [
    new (winston.transports.Console)({
      format: combine(
        colorize({all: true }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      )
  })
  ]
})

if(process.env.NODE_ENV === "test") logger.silent = true

export default logger