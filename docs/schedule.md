# Schedule API Spec

## 1. List Schedule 

Endpoint : GET /schedule/list

Response Body Success :

```json
{
  "data" : [
    {
      "mata_kuliah" : "METODOLOGI PENELITIAN	",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18"
    },
    {
      "mata_kuliah" : "METODOLOGI PENELITIAN	",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18"
    }
  ]
}
```

Response Body Error :

```json
{
  "error" : "Jadwal tidak ditemukan" 
}
```

## 2. Create Schedule API

Endpoint : POST /schedule/create

Headers : 
- Authorization : token

Request Body :

```json
{
  "mata_kuliah" : "METODOLOGI PENELITIAN",
  "nama_kelas" : "MP-A",
  "sks" : "2",
  "hari" : "selasa",
  "jam_mulai" : "080000",
  "jam_selesai" : "090000",
  "ruangan" : "H18"
}
```

Response Body Success : 

```json
{
  "data" : {
    "user": "211510001",
    "id_mata_kuliah" : "unique-id",
    "mata_kuliah" : "METODOLOGI PENELITIAN	",
    "nama_kelas" : "MP-A",
    "sks" : "2",
    "hari" : "selasa",
    "jam_mulai" : "080000",
    "jam_selesai" : "090000",
    "ruangan" : "H18"
  }
}
```

Response Body Error :

```json
{
  "error" : "Jadwal Bentrok"
}
```

## 3. Update Schedule API

Endpoint : PUT /schedule/update/:id_mata_kuliah

Headers :
- Authorization : token

Request Body :

```json
{
  "mata_kuliah" : "METODOLOGI PENELITIAN	",
  "nama_kelas" : "MP-A",
  "sks" : "2",
  "hari" : "selasa",
  "jam_mulai" : "080000",
  "jam_selesai" : "090000",
  "ruangan" : "H18"
}
```

Response Body Success :

```json
{
  "data" : {
    "user": "211510001",
    "id_mata_kuliah" : "unique-id",
    "mata_kuliah" : "METODOLOGI PENELITIAN	",
    "nama_kelas" : "MP-A",
    "sks" : "2",
    "hari" : "selasa",
    "jam_mulai" : "080000",
    "jam_selesai" : "090000",
    "ruangan" : "H18"
  }
}
```

Response Body Error :

```json
{
  "error" : "Jadwal Bentrok"
}
```

## 4. Remove Schedule API

Endpoint : DELETE /schedule/remove/:id_mata_kuliah

Headers :
- Authorization : token

Response Body Success :

```json
{
  "data" : "OK"
}
```

Response Body Error :

```json
{
  "error" : "Jadwal tidak ditemukan"
}
```

## 5. Get User Schedule

Endpoint : GET /schedule/user/:user

Response Body Success :

```json
{
  "data" : [
    {
      "mata_kuliah" : "METODOLOGI PENELITIAN	",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18"
    },
    {
      "mata_kuliah" : "METODOLOGI PENELITIAN	",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18"
    }
  ]
}
```

Response Body Error :

```json
{
  "error" : "Jadwal tidak ditemukan" 
}
```