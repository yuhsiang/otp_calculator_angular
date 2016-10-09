var UserOTP = require('./models/userOTP');

function getUserOTPs(res) {
    UserOTP.find(function (err, user_otp) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(user_otp); // return all user_otp in JSON format
    });
}

module.exports = function (app) {
    app.get('/api/user_otp', function (req, res) {
        // use mongoose to get all user_otp in the database
        getUserOTPs(res);
    });

    // create todo and send back all user_otp after creation
    app.post('/api/user_otp', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        UserOTP.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the user_otp after you create another
            getUserOTPs(res);
        });

    });

    // delete a todo
    app.delete('/api/user_otp/:otp_id', function (req, res) {
        UserOTP.remove({
            _id: req.params.otp_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getUserOTPs(res);
        });
    });

    app.put('/api/user_otp/:otp_id', function (req, res) {
        UserOTP.findById({
            _id: req.params.otp_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            todo.keys = req.body.keys;
            todo.save(function(err){
                res.json(todo);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
