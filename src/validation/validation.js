import { ResponseError } from "../error/error.js";

const validation = (validationSchema, requestInput) => {
  const result = validationSchema.validate(requestInput, {
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