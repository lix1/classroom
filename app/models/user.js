var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');
var crypto = require('crypto');

// max of 5 attempts, resulting in a 15 mins lock
var MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 15 * 60 * 1000;

var secRoles = 'student admin'.split(' ');

function secRoleValidator (v) {
    return v.every(function (val) {
        return !!~secRoles.indexOf(val)
    });
}

var schema = new Schema({
    _userProfile:    { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    email:        {   type: String, lowercase: true, trim: true,
                    validate: {
                        validator: function(v) {
                            return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.edu$/.test(v);
                        },
                        message: '{VALUE} is not a valid university email!'
                    }},
    password:   { type: String, required : true },
    salt:       { type: String },
    iterations: { type: Number },
    keylen:     { type: Number },
    digest:     { type: String },

    lastLoginTS: { type: Date },
    isVerified: {type : Boolean, default : false},
    secRoles:  { type: [String], validate: secRoleValidator, default: 'student' },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
    updatedAt: { type: Date, default: Date.now }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

schema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});

schema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    user.iterations=100000;
    user.keylen=512;
    user.digest='sha512';
    user.salt = user.genSalt();
    crypto.pbkdf2(user.password, this.salt, this.iterations, this.keylen, this.digest, function(err, key) {
        if (err) return next(err);
        user.password = key.toString('hex');
        next();
    });
});

var reasons = schema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

schema.methods = {
    genSalt: function () {
        const buf = crypto.randomBytes(this.keylen);
        return buf.toString('hex');
    },
    comparePassword: function (candidatePassword, cb) {
        var user = this;
        crypto.pbkdf2(candidatePassword, this.salt, this.iterations, this.keylen, this.digest, function(err, key) {
            if (err) return cb(err);
            var hashedCandidate = key.toString('hex');
            if (user.password == hashedCandidate) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        });
    },
    incLoginAttempts: function(cb) {
        // if we have a previous lock that has expired, restart at 1
        if (this.lockUntil && this.lockUntil < Date.now()) {
            return this.update({
                $set: {loginAttempts: 1},
                $unset: {lockUntil: 1}
            }, cb);
        }
        // otherwise we're incrementing
        var updates = {$inc: {loginAttempts: 1}};
        // lock the account if we've reached max attempts and it's not locked already
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
            updates.$set = {lockUntil: Date.now() + LOCK_TIME};
        }
        return this.update(updates, cb);
    }
}

schema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email })
        .populate('_userProfile', '_id firstName lastName _university')
        .exec(function (err, user) {
            if (err) return cb(err);

            // make sure the user exists
            if (!user) {
                return cb(null, null, reasons.NOT_FOUND);
            }

            // check if the account is currently locked
            if (user.isLocked) {
                // just increment login attempts if account is already locked
                return user.incLoginAttempts(function(err) {
                    if (err) return cb(err);
                    return cb(null, null, reasons.MAX_ATTEMPTS);
                });
            }

            // test for a matching password
            user.comparePassword(password, function(err, isMatch) {
                if (err) return cb(err);

                // check if the password was a match
                if (isMatch) {
                    // if there's no lock or failed attempts, just return the user
                    if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                    // reset attempts and lock info
                    var updates = {
                        $set: { loginAttempts: 0 },
                        $unset: { lockUntil: 1 }
                    };
                    return user.update(updates, function(err) {
                        if (err) return cb(err);
                        return cb(null, user);
                    });
                }

                // password is incorrect, so increment login attempts before responding
                user.incLoginAttempts(function(err) {
                    if (err) return cb(err);
                    return cb(null, null, reasons.PASSWORD_INCORRECT);
                });
            });
        });
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', schema);
