# User API Spec

## 1. Login User API

Public endpoint : POST /user/login

Request Body :
```json
{
  "user" : "2115061073",
  "password" : "2115061073"
}
```

Response Body Success : 
```json
{
  "data" : {
    "token" : "unique-token"
  }
}
```

Response Body Error :
```json
{
  "error" : "User atau password salah"
}
```

## 2. Token User API

Private endpoint : GET /user/authentication

Headers :
- Authorization : token

Response Body Success : 
```json
{
  "data" : "Token user 2115061073 is authorized"
}
```

Response Body Error :
```json
{
  "error" : "Unauthorized"
}
```
