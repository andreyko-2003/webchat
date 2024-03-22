const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();

const port = 5000;
const secretKey = 'RYT_secret';

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users 
        (
            id TEXT PRIMARY KEY,
            firstName TEXT,
            lastName TEXT, 
            username TEXT UNIQUE, 
            avatar TEXT,
            email TEXT UNIQUE, 
            password TEXT
        )`
    );
});

app.post('/sign-up', async (req, res) => {
    const { firstName, lastName, username, avatar, email, password } = req.body;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to register user' });
        }
        if (row) {
            if (row.email === email && row.username === username) {
                return res.status(400).json({ error: 'User with this email and username already exists' });
            } else if (row.email === email) {
                return res.status(400).json({ error: 'User with this email already exists' });
            } else {
                return res.status(400).json({ error: 'User with this username already exists' });
            }
        }

        db.run('INSERT INTO users (id, firstName, lastName, username, avatar, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, firstName, lastName, username, avatar, email, hashedPassword], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user' });
            }

            const token = jwt.sign({ id, firstName, lastName, avatar, username, email }, secretKey, { expiresIn: '1h' });
            res.json({ message: 'User registered successfully', token });
        });
    });
});
app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Wrong password' });
        }
        const { id, name, lastName, avatar, username, email } = user;
        const token = jwt.sign({ id, name, lastName, avatar, username, email }, secretKey, { expiresIn: '1h' });
        res.json({ message: 'User logged in successfully', token });
    });
});

const getUserByToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.get('/me', getUserByToken, (req, res) => {
    const { id: userId } = req.user;
  
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.sendStatus(500);
        }
    
        if (user) {
            const { id, name, lastName, avatar, username, email } = user;
            res.json({ id, name, lastName, avatar, username, email });
        } else {
            res.sendStatus(404);
        }
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
