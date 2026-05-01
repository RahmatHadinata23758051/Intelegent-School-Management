export class APIError extends Error {
  constructor(message, statusCode = 400, data = null) {
    super(message)
    this.statusCode = statusCode
    this.data = data
    this.name = 'APIError'
  }
}

export class ValidationError extends APIError {
  constructor(errors) {
    super('Validation failed', 422, errors)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends APIError {
  constructor(resource) {
    super(`${resource} not found`, 404)
    this.name = 'NotFoundError'
  }
}

export const errorHandler = {
  handle: (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message || 'An error occurred'

      switch (status) {
        case 401:
          return new UnauthorizedError(message)
        case 404:
          return new NotFoundError(message)
        case 422:
          return new ValidationError(data?.errors || data)
        default:
          return new APIError(message, status, data)
      }
    } else if (error.request) {
      return new APIError('No response from server')
    } else {
      return new APIError(error.message)
    }
  },
}
