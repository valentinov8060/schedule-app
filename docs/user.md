# User API Spec

## 1. Login User API

Endpoint : POST /user/login

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
  "errors" : "User atau password salah"
}
```


## 2. Logout User API

Endpoint : DELETE /user/logout  

Headers :
- Authorization : token

Response Body Success : 

```json
{
  "data" : "Logout success"
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```