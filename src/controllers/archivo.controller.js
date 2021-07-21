import { pool } from "../database"

export const readAllArchivo=async(req,res)=>{
    try {
        const id=parseInt(req.params.id);
        const response=await pool.query('select * from fc_list_archivo_user($1)',[id]);
        return res.status(200).json(response.rows);        
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}

export const createArchivo=async(req,res)=>{

    try {
        const{nombre,tipo,url,idusuario}=req.body;
        await pool.query('select * from fc_create_archivo($1,$2,$3,$4)',[nombre,tipo,url,idusuario]);
        return res.status(200).json(`El archivo se ha creado correctamente`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}

export const delArchivo=async(req,res)=>{
    try {
        const id=parseInt(req.params.id);
        await pool.query('select fc_delete_archivo($1)',[id]);
        return res.status(200).json(`El archivo se ha eliminado correctamente.....`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}