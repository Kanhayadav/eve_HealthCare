import {Router} from 'express'
import { auth_middleware } from '../middlewares/auth_middleware'
import pool from "../config/db"
const router=Router()

router.post('/booking', auth_middleware, async (req,res)=>{
    const userId=(req as any).userId
    const { centreId, testId, appointment } = req.body;
    
    try{
   const appointmentDate = new Date(appointment);
   if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        message: "Invalid appointment date"
      });
    }
     if (appointmentDate <= new Date()) {
      return res.status(400).json({
        message: "Appointment must be in the future"
      });
    }

    const result = await pool.query(
      `
      SELECT 
        c.id AS centre_id,
        c.name AS centre_name,
        t.id AS test_id,
        t.name AS test_name,
        ct.price
      FROM centre_tests ct
      JOIN centres c ON c.id = ct.centre_id
      JOIN tests t ON t.id = ct.test_id
      WHERE c.id = $1
      AND t.id = $2
      `,
      [centreId, testId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Centre does not offer this test"
      });
    }

     const { price } = result.rows[0];

    const booking=await pool.query(`insert into bookings(user_id,test_id,centre_id,appointment,amount,status) values ($1,$2,$3,$4,$5,'PENDING') Returning *`,[userId,testId,centreId,appointmentDate,price]);
    return res.status(201).json({
        message:"booking created",
        booking:booking.rows[0]
    })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message:"something went wrong"
        })
    }
})



export default router