import { Router } from "express";
import { auth_middleware } from "../middlewares/auth_middleware";
import pool from "../config/db";

const router = Router();

router.post("/payments", auth_middleware, async (req, res) => {
  const userId = (req as any).userId;
  const { bookingId } = req.body;

  try {
    const booking = await pool.query(
      `
      SELECT id, amount, status
      FROM bookings
      WHERE id = $1 AND user_id = $2
      `,
      [bookingId, userId]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.rows[0].status !== "PENDING") {
      return res.status(400).json({
        message: "Booking is not pending"
      });
    }

    const amount = booking.rows[0].amount;

    const success = Math.random() < 0.8;

    const paymentStatus = success ? "SUCCESS" : "FAILED";
    const bookingStatus = success ? "CONFIRMED" : "FAILED";

    const payment = await pool.query(
      `
      INSERT INTO payments
      (booking_id, event_id, amount, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        bookingId,
        `payment_${bookingId}_${Date.now()}`,
        amount,
        paymentStatus
      ]
    );

    await pool.query(
      `
      UPDATE bookings
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [bookingStatus, bookingId]
    );

    return res.status(200).json({
      message: success ? "Payment successful" : "Payment failed",
      payment: payment.rows[0],
      bookingStatus
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Payment processing failed"
    });
  }
});

router.post("/webhook", async (req, res) => {
  const { eventId, bookingId, status } = req.body;

  try {
    const existingPayment = await pool.query(
      "SELECT id FROM payments WHERE event_id = $1",
      [eventId]
    );

    if (existingPayment.rows.length > 0) {
      return res.status(200).json({
        message: "Webhook already processed"
      });
    }


    const booking = await pool.query(
      "SELECT id, amount FROM bookings WHERE id = $1",
      [bookingId]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const bookingStatus =
      status === "SUCCESS" ? "CONFIRMED" : "FAILED";


    await pool.query(
      `
      INSERT INTO payments
      (booking_id, event_id, amount, status)
      VALUES ($1, $2, $3, $4)
      `,
      [
        bookingId,
        eventId,
        booking.rows[0].amount,
        status
      ]
    );

    await pool.query(
      `
      UPDATE bookings
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [bookingStatus, bookingId]
    );

    return res.status(200).json({
      message: "Webhook processed",
      bookingStatus
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Webhook processing failed"
    });
  }
});

export default router;