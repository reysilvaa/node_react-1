const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const db = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "mokletrestapi"
})

db.connect(err => {
    if (err) console.log(err.message)
    else console.log("koneksi berhasil")
    
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /pegawai --> end point untuk mengakses data pegawai
app.get("/pegawai", (req,res) => {
    let sql = "select * from pegawai"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                pegawai: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })

    
})

// POST: /pegawai --> end point untuk pencarian data pegawai
app.post("/pegawai", (req,res) => {
    let find = req.body.find
    let sql = "select * from pegawai where id_pegawai like '%"+find+"%' or nama_pegawai like '%"+find+"%' or alamat like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                pegawai: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /pegawai/save --> end point untuk insert data pegawai
app.post("/pegawai/save", (req,res) => {
    let data = {
        id_pegawai: req.body.id_pegawai,
        nama_pegawai: req.body.nama_pegawai,
        alamat: req.body.alamat
    }
    let message = ""

    let sql = "insert into pegawai set ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row inserted"
        }

        let response = {
            message : message
        }
    
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })

    
})

// POST: /pegawai/update --> end point untuk update data pegawai
app.post("/pegawai/update", (req,res) => {
    let data = [{
        id_pegawai: req.body.id_pegawai,
        nama_pegawai: req.body.nama_pegawai,
        alamat: req.body.alamat
    }, req.body.id_pegawai]
    let message = ""

    let sql = "update pegawai set ? where id_pegawai = ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row updated"
        }

        let response = {
            message : message
        }
    
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })

    
})

// DELETE: /pegawai/:id_pegawai --> end point untuk hapus data pegawai
app.delete("/pegawai/:id_pegawai", (req,res) => {
    let data = {
        id_pegawai : req.params.id_pegawai
    }
    let message = ""
    let sql = "delete from pegawai where ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row deleted"
        }

        let response = {
            message : message
        }
    
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })

    
})


app.listen(2000, () => {
    console.log("Server run on port 2000");
})