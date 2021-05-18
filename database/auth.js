const mysql = require("mysql");
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const upload = path.join(__dirname, '../upload/')


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    const {name, email, phone, password, confirmPassword } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                massage: 'That email is already in use'
            })
        } else if( name == 0 ){
            return res.render('register',{
                message: 'Name cannot be empty'
            });
        } else if( phone < 8 ){
            return res.render('register',{
                message: 'Mobile number should not be empty'
            });
        } else if( email < 0 ){
            return res.render('register',{
                message: 'Email should not be empty'
            });
        } else if(password < 8 ){
            return res.render('register',{
                message: 'Password need to be 8 character'
            });
        } else if( password !== confirmPassword ){
            return res.render('register',{
                message: 'Password do not match'
            });
        } else {
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query('INSERT INTO users SET ?', {name: name, email: email, phone: phone, password: hashedPassword }, (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('register',{
                        message: 'Register Completed'
                    });
                }
            })
        }
    });
}

exports.login = (req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).render('login',{
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (!results || !(await bcrypt.compare(password, results[0].password) )){
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].id;

                // Create Cookies

                const cookisOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('email', results[0].email, cookisOptions);
                res.status(200).redirect("/home")
            }
        });
    } catch (error){
        console.log(req.body);
    }
}

exports.updateUsername = (req, res) =>{
    try{
        const {name} = req.body;
        const email = req.cookies['email'];
        if ( name == 0 ){
            res.redirect("/wrongInfoProfile");
        } else {
            db.query('UPDATE users SET name = ? WHERE email = ?', [name, email], async (error, results) => {
                if (error){
                    res.redirect("/wrongInfoProfile");
                } else {
                    res.status(200).redirect("/successInfoProfile");
                }
            });
        }
    }catch (error){
        console.log(req.body);
    }
};

exports.updatePassword = (req,res) =>{
    try{
        const {oldPassword, newPassword, confirmPassword} = req.body;
        const email = req.cookies['email'];

        if (!oldPassword || !newPassword || !confirmPassword){
            res.redirect("/wrongInfoProfile");
        } else if (newPassword !== confirmPassword) {
            res.redirect("/wrongInfoProfile");
        } else {
            db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
                if (!results || !(await bcrypt.compare(oldPassword, results[0].password) )){
                    console.log(res.body);
                    res.redirect('/passwordWrongInfo')
                } else { 
                    let hashedPassword = await bcrypt.hash(newPassword, 8);
                    console.log(hashedPassword);
                    
                    db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], async (error, results) => {
                        if (error){
                            res.redirect("/passwordWrongInfo");
                        } else {
                            res.status(200).redirect("/successInfoProfile");
                        }
                    });
                }
            });
        }
    } catch (error){
        console.log(req.body);
    }
};

exports.sell = (req, res) => {
    // console.log(req.body);

    let sampleFile;
    let uploadPath;
    let userId;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.sampleFile;
    uploadPath = upload + sampleFile.name;

    sampleFile.mv(uploadPath, function (err){
        if (err) return res.status(500).send(err);

        // // getUserId
        const email = req.cookies['email'];
        db.query('SELECT userId FROM users WHERE email = ?', [email], (error, results) => {
            if (error){
                console.log(error);
            } else { 
                // INSERT Product to database
                userId = results[0].userId;
                const {productName, description} = req.body;

                if (productName == 0){
                    return res.render('sell', {
                        message: "There are something infos missing"
                    });
                } else if (description == 0){
                    return res.render('sell', {
                        message: "There are something infos missing"
                    });
                } else {
                    db.query('INSERT INTO product SET ?',{userId: userId,  productName: productName, productContent: description, productImg: sampleFile.name}, (error, results) => {
                        if(error){
                            console.log(error);
                        } else {
                            return res.render('sell',{
                                message: 'Upload Post Completed'
                            });
                        }
                    });
                }
            }
        });
    });
};

exports.favourite = (req,res) => {

    if (req.cookies['email'] == undefined){
        res.render('home',{
            message: "Please Login First"
        });
    } else {
        db.query('SELECT * FROM users WHERE email = ?', [req.cookies['email']], (error, results) => {
            db.query('SELECT * FROM favourite WHERE productId = ? and userId = ?', [req.params.productId, results[0].userId], (error, check1) => {
                // Check if added before
                console.log(check1);
                if (check1.length > 0){
                    res.render('home',{
                        username: results[0].name,
                        message: "You can't add the same product once again"
                    });
                    
                } else {
                    // Second Check whether own product
                    db.query('SELECT * FROM product WHERE productId = ? and userId = ?', [req.params.productId, results[0].userId], (error, check2) => {
                        if (check2.length > 0){
                            res.render('home',{
                                username: results[0].name,
                                message: "You can't add your own product"
                            });
                        } else {
                            db.query('INSERT INTO favourite SET ?', {userId: results[0].userId, productId: req.params.productId}, (error, success) => {
                                if (error){
                                    res.send("Fail to add")
                                } else {
                                    res.redirect("/added")
                                }
                            });
                        }
                    });
                }
            });
        });
    }
};

exports.edit = (req,res) => {

    if (req.cookies['email'] == undefined){
        res.render('home',{
            message: "Please Login First"
        });
    } else {
        db.query('SELECT userId, name FROM users WHERE email = ?', [req.cookies['email']],(error, getId) => {
            db.query('SELECT * FROM product WHERE productId = ? AND userId = ?', [req.params.productId, getId[0].userId], (error, results)=>{
                
                if (results.length > 0){
                    const file = upload+results[0].productImg;
                    results[0].productImg;
                    res.render('edit', {
                        results,
                        username: getId[0].name,
                        file : file
                    });
                } else {
                    res.redirect('/wronguser');
                }
            });
        });
    }

};

exports.update = (req,res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.sampleFile;
    uploadPath = upload + sampleFile.name;
    console.log(sampleFile);

    sampleFile.mv(uploadPath, function (err){
        if (err) return res.status(500).send(err);

        // Update Product to database
        const {productName, description} = req.body;

        if (productName == 0){
            return res.render('edit', {
                message: "There are something infos missing"
            });
        } else if (description == 0){
            return res.render('edit', {
                message: "There are something infos missing"
            });
        } else {
            // Delete Img in local folder
            db.query('SELECT productImg FROM product WHERE productId = ?', [req.params.productId], (error, results) => {
                const file = upload+results[0].productImg;
                fs.unlink(file, function(err){
                    if (err){
                        console.log("Error to delete"+err);
                    }
                })
            })
            // Update Product
            db.query('UPDATE product SET productName = ?, productContent = ?, productImg = ? WHERE productId = ?',[productName, description, sampleFile.name, req.params.productId], (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    return res.render('edit',{
                        message: 'Upload Post Completed'
                    });
                }
            });
        }
    });
}

exports.delete = (req,res) => {
    if (req.cookies['email'] == undefined){
        res.render('home',{
            message: "Please Login First"
        });
    } else {
        // Get userID
        db.query('SELECT userId, name FROM users WHERE email = ?', [req.cookies['email']],(error, getId) => {
            // If productId match with userId
            db.query('SELECT * FROM product WHERE productId = ? AND userId = ?', [req.params.productId, getId[0].userId], (error, results)=>{
                if (results.length > 0){
                    // Delete Photo in Local Folder
                    db.query('SELECT productImg FROM product WHERE productId = ?', [req.params.productId], (error, img) => {
                        const file = upload+img[0].productImg;
                        fs.unlink(file, function(err){
                            if (err){
                                console.log("Error to delete"+err);
                            }
                        })
                    
                        // Delete Method
                        db.query('DELETE FROM product WHERE productId = ?', [req.params.productId], (error, deleted)=>{
                        
                            res.render('home',{
                                username: getId[0].name,
                                message: "Success to Delete your product"
                            });
                        }); // End with Delete Method
                    }); // End with Delete Photo
                } else {
                    res.redirect('/wronguser')
                }
                
            });
        });
    };
};

exports.deleteFavourite = (req,res) => {
    db.query('SELECT userId FROM users WHERE email = ?',[req.cookies['email']], (error, results)=>{
        
        db.query('DELETE FROM favourite WHERE userId = ? and productId = ?', [results[0].userId, req.params.productId], (error, deleted)=>{
            res.redirect('/deletedFavourite');
        });
    });
};

exports.logout = (req,res) => {
    res.clearCookie('email');
    res.redirect('/');
};