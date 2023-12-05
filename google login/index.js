const express = require('express')
const passport = require('passport')
const session = require("express-session")
const dotenv = require('dotenv').config()
const path = require('path')
const app = express()

require("./auth")

app.use(express.json())
app.use(express.static(path.join(__dirname, 'client')))

const port = process.env.PORT || 5001

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


app.get('/', (req, res) => {
    res.sendFile('index.html')
})

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401)
}

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport, passport.initialize())
app.use(passport.session())

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
    }));

app.get('/auth/google/failure', (req, res) => {
    res.send("something went wrong")
})

app.get('/auth/protected', isLoggedIn, (req, res) => {
    let name = req.user.displayName
    res.send(`Hello ${name}`)
})

app.get('/auth/logout', (req, res) => {
    req.session.destroy()
    res.send('See you agan')
})

