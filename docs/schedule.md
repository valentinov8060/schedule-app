# Schedule API Spec

## 1. Create Schedule API

Private endpoint : POST /schedule/create

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

## 2. Update Schedule API

Private endpoint : PUT /schedule/update/:id_mata_kuliah

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
  "data": {
    "id_mata_kuliah": "0c2ad76f-a142-4bae-87e1-2115572362c5",
    "mata_kuliah": "OOP",
    "nama_kelas": "OOP-C",
    "sks": 4,
    "hari": "Senin",
    "jam_mulai": "10:00:00",
    "jam_selesai": "11:00:00",
    "ruangan": "H19",
    "user": "2115061073"
  }
}
```

Response Body Error :
```json
{
  "error" : "Jadwal Bentrok"
}
```

## 3. Remove Schedule API

Private endpoint : DELETE /schedule/remove/:id_mata_kuliah

Headers :
- Authorization : token

Response Body Success :
```json
{
  "data" : "Mata Kuliah Berhasil Dihapus"
}
```

Response Body Error :
```json
{
  "error" : "Jadwal tidak ditemukan"
}
```

## 4. List Schedule API

Public endpoint : GET /schedule/list

Response Body Success :
```json
{
  "data" : [
    {
      "id_mata_kuliah" : "2cd28e07-1e80-468e-ac06-623e94dabf55",
      "mata_kuliah" : "METODOLOGI PENELITIAN",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18",
      "user" : "2115061054"
    },
    {
      "id_mata_kuliah" : "2cd28e07-1e80-468e-ac06-623e94dabf55",
      "mata_kuliah" : "METODOLOGI PENELITIAN",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18",
      "user" : "2115061054"
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

## 5. Get User Schedule API

Public endpoint : GET /schedule/user/:user

Response Body Success :
```json
{
  "data" : [
    {
      "id_mata_kuliah" : "2cd28e07-1e80-468e-ac06-623e94dabf55",
      "mata_kuliah" : "METODOLOGI PENELITIAN",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18",
      "user" : "2115061054"
    },
    {
      "id_mata_kuliah" : "2cd28e07-1e80-468e-ac06-623e94dabf55",
      "mata_kuliah" : "METODOLOGI PENELITIAN",
      "nama_kelas" : "MP-A",
      "sks" : "2",
      "hari" : "selasa",
      "jam_mulai" : "080000",
      "jam_selesai" : "090000",
      "ruangan" : "H18",
      "user" : "2115061054"
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