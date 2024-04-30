# Schedule API Spec

## 1. List Schedule 

Endpoint : GET /schedule/list?page=1&size=5

Query params :
- page : number of page, default 1
- size : size per page, default 20

Response Body Success :

```json
{
  "data" : {
    "schedules" : [
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
    ],
    "paging" : {
      "page" : 1,
      "total_page" : 3,
      "total_data" : 30
    }
  }
}
```

Response Body Error :

```json
{
  "errors" : "Jadwal tidak ditemukan" 
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
  "errors" : "Jadwal Bentrok"
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
  "errors" : "Jadwal Bentrok"
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
  "errors" : "Jadwal tidak ditemukan"
}
```