import { Router } from "express";
import pool from "../config/db";

const router = Router();

//pagination is requierd and just simply displace the centre name , locaiton ,avalialle test , test price
router.get("/centre", async (req, res) => {
  try {

    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 10;
    const offset=(page-1) * limit
    const data = await pool.query(
      "select c.name,c.location,t.name as test,ct.price from centre_tests ct join centres c on ct.centre_id=c.id join tests t on t.id=ct.test_id order by c.id limit $1 offset $2",[limit,offset]
    );
    if (data.rows.length === 0) {
      return res.status(401).json({
        message: "no centres for now",
      });
    }
    res.status(200).json({
      centres: data.rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error Fetching centres",
    });
  }
});

export default router;
