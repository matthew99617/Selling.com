const express = require('express');
const mysql = require('mysql');
const hbs = require('hbs');
const router = express.Router();

router.get("/home", (req, res) => {
    if (req.cookies['email'] == undefined){
        getProductOnly(res);
    } else {
        getHomeData(req.path, req.cookies['email'], res);
    }
});

router.get("/sell", (req, res) => {
    getHomeData(req.path, req.cookies['email'], res);
});

router.get("/profile", (req, res) => {
    getAllUserData(req.path, req.cookies['email'], res);
});

router.get("/favourite", (req, res) => {
    getHomeData(req.path, req.cookies['email'], res);
});

router.get("/", (req, res) => {
    if (req.cookies['email'] == undefined){
        res.redirect("/home")
    } else {
        getHomeData("/home", req.cookies['email'], res);
    }
});

router.get("/sell", (req, res) => {
    getAllUserData(req.path, req.cookies['email'], res);
});

router.get("/login", (req, res) => {
    res.render("login")
});

router.get("/register", (req, res) => {
    res.render("register")
});

router.get('/logout', (req, res) => {
    res.clearCookie('email');
    res.redirect("/")
});

router.get('/wrongInfoProfile', (req, res) => {
    getAllUserData(req.path, req.cookies['email'], res);
});

router.get('/successInfoProfile', (req, res) => {
    getAllUserData(req.path, req.cookies['email'], res);
});

router.get('/passwordWrongInfo', (req, res) => {
    getAllUserData(req.path, req.cookies['email'], res);
});

router.get('/added', (req, res) => {
    getHomeData(req.path, req.cookies['email'], res);
});

router.get('/deleted', (req, res) => {
    getHomeData(req.path, req.cookies['email'], res);
});

router.get('/wronguser', (req, res) => {
    getHomeData(req.path, req.cookies['email'], res);
});

router.get('/deletedFavourite', (req, res) => {
    getHomeData(req.path, req.cookies['email'], res);
});

module.exports = router;

// All Functions
function getHomeData(path, email, res){

    const db = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    });

    db.query('SELECT name, userId FROM users WHERE email = ?', [email], (error, results) => {
        if (error){
            console.log(results);
            return res.status(400).redirect('home');
        }else if (path == '/home'){
            // Show Product
            db.query('SELECT * FROM product', (error, showProduct) => {
                // Get Product Data
                return res.render('home', {
                    username: results[0].name,
                    showProduct: showProduct,
                });
            });
        } else if (path == '/added'){
            db.query('SELECT * FROM product', (error, showProduct) => {
                // Get Product Data
                return res.render('added', {
                    username: results[0].name,
                    showProduct: showProduct,
                    message: "Added to Favourite"
                });
            });

        } else if (path == '/deleted'){
            db.query('SELECT * FROM product', (error, showProduct) => {
                return res.render('deleted', {
                    username: results[0].name,
                    showProduct: showProduct,
                    message: "Deleted Your Product"
                });
            });

        } else if (path == '/wronguser'){
            db.query('SELECT * FROM product', (error, showProduct) => {
                return res.render('wronguser', {
                    username: results[0].name,
                    showProduct: showProduct,
                    message: "You can't edit/deleted other person products"
                });
            });

        } else if (path == '/favourite'){
            // GET favourite list
            db.query('SELECT product.productId, product.productName FROM product INNER JOIN favourite ON favourite.productId = product.productId WHERE favourite.userId = ?',[results[0].userId], (error, getProductName) => {
                return res.render('favourite', {
                    username: results[0].name,
                    getProductName: getProductName,
                });
            });

        } else if (path == '/deletedFavourite'){
            db.query('SELECT product.productId, product.productName FROM product INNER JOIN favourite ON favourite.productId = product.productId WHERE favourite.userId = ?',[results[0].userId], (error, getProductName) => {
                return res.render('deletedFavourite', {
                    username: results[0].name,
                    getProductName: getProductName,
                    message: "Favourite Deleted Completed"
                });
            });

        } else if (path == '/sell'){
            return res.render('sell', {username: results[0].name});
        } else {
            return res.render('home', {
                username: results[0].name,
                showProduct: showProduct,
            });
        }
    });
}

function getAllUserData(path, email, res){
    const db = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    });

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error){
            return res.status(400).redirect('/');
        }else if (path == '/profile'){
            res.render('profile', {
                username: results[0].name ,
                phone: results[0].phone,
                email: results[0].email});
        } else if (path == '/wrongInfoProfile'){
            res.render('wrongInfoProfile', {
                username: results[0].name ,
                phone: results[0].phone,
                email: results[0].email,
                message: "Something Wrong on Changes"});
        } else if (path == '/successInfoProfile'){
            res.render('successInfoProfile', {
                username: results[0].name ,
                phone: results[0].phone,
                email: results[0].email,
                message: "Update Completed"});
        } else {
            res.render('passwordWrongInfo', {
                username: results[0].name ,
                phone: results[0].phone,
                email: results[0].email,
                message: "Password is not matching"});
        }
    });
}

function getProductOnly(res){
    const db = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    });

    db.query('SELECT * FROM product', (error, showProduct) => {
        // Get Product Data
        return res.render('home', {
            showProduct: showProduct
        });
    });
}