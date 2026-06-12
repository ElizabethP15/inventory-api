const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack)

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.errors.map((e) => e.message),
    })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflicto de datos',
      details: err.errors.map((e) => e.message),
    })
  }

  res
    .status(err.status || 500)
    .json({ error: err.message || 'Error interno del servidor' })
}

export default errorMiddleware
