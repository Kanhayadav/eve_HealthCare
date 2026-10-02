import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { jwt_key } from "../config";
import bcrypt from "bcrypt";

const router = Router();
router.post("/signup", async (req, res) => {
  const reqbody = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(30),
    email: z.string().email("Invalid email").max(30),
    password: z.string().min(5, "Password must be at least 5 characters"),
  });

  const parse_req_body = reqbody.safeParse(req.body);

  if (!parse_req_body.success) {
    return res.status(400).json({
      message: "incorrect format",
      err: parse_req_body.error,
    });
  }
  const { name, email, password } = parse_req_body.data;

  try {
    const user = await pool.query("select id from users where email = $1", [
      email,
    ]);
    if (user.rows.length > 0) {
      return res.status(409).json({
        message: "User already Exits",
      });
    }
    const hash_pass = await bcrypt.hash(password, 10);
    await pool.query(
      "insert into users (name,email,password_hash) values ($1,$2,$3)",
      [name, email, hash_pass],
    );
    res.status(201).json({
      message: "User resgisterd",
    });
  } catch (err) {
    res.status(500).json({
      message: "error at signup",
      err: err,
    });
  }
});

router.post("/login", async (req, res) => {
  const reqbody = z.object({
    email: z.string().email("Invalid email").max(30),
    password: z.string().min(5, "Password must be at least 5 characters"),
  });

  const parse_req_body = reqbody.safeParse(req.body);
  if (!parse_req_body.success) {
    return res.status(400).json({
      message: "incorrect format",
      err: parse_req_body.error,
    });
  }
  const { email, password } = parse_req_body.data;
  try {
    const user = await pool.query(
      "select id,password_hash from users where email = $1",
      [email],
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        message: "incorret email of password",
      });
    }
    const password_check_pass = await bcrypt.compare(
      password,
      user.rows[0].password_hash,
    );

    if (!password_check_pass) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }
    const token = jwt.sign(
      {
        id: user.rows[0].id,
      },
      jwt_key,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
      message: "Login Sucess",
    });
  } catch (err) {
    res.status(500).json({
      message: "error at login",
      err: err,
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  res.status(200).json({
    message: "logout sucessfullly",
  });
});

export default router;
