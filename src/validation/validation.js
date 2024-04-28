import { ResponseError } from "../error/error.js";

const validation = (validationSchema, request) => {
  const result = validationSchema.validate(request, {
    abortEarly: false,
    allowUnknown: false
  })

  if (result.error) {
    throw new ResponseError (404, result.error.message);
  } else {
    return result.value
  }
}

export {
  validation
}