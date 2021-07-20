import { transporter } from '../libs/helper.email';
import { pool } from "../database"

export const createCorreo=async(req,res)=>{

    try {
        const {destinatario, titulo, mensaje, idusuario} = req.body;
        const response = await pool.query('select fc_create_correo($1,$2,$3,$4)', [destinatario, titulo, mensaje, idusuario]);
        if(response){
           await sendEmail(destinatario,titulo,mensaje);
        }
        return res.status(200).json(`Correo ${titulo} registrado correctamente`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}

async function sendEmail(destino, title, texto){
    try {
        await transporter.sendMail({
            from: 'EliasMH  <catdoupeu@gmail.com>', // sender address
            to: destino, // list of receivers
            subject: title, // Subject line
            html: '<!DOCTYPE html>' +
                '<html><head><title>Appointment</title>' +
                '</head><body><div>' +
                '<p>' + texto + '</p>' // html body
          });
          return res.status(200).json('correo enviado correctamente...!');
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!');
    }
}