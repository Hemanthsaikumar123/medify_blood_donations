const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password , city, latitude, longitude} = req.body;

        const existingUser = await pool.query(
            `SELECT * FROM users WHERE email=$1`, [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users
            (name,email,phone,password_hash,city,latitude,longitude)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING email, name, phone, city, latitude, longitude
            `,
            [
                name,
                email,
                phone,
                hashedPassword,
                city,
                latitude,
                longitude
            ]
        );

        res.status(201).json({
            message: 'User registered',
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
};

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await pool.query(
            `SELECT * FROM users WHERE email=$1`, [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({token});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
};