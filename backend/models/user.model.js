import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true , "Name is required"]
    },
    email:{
        type: String,
        required : [true, "Email is required"],
        unique : true,
        trim : true,
        lowercase : true
    },
    password  :{
        type : String,
        required : [true , "Password is required"],
        minlength : [4 , "Password must be atleast 4 characters long"]
    },
    cartItems : [  // tricky part
        {
            quantity : {
                type : Number,
                default : 1
            },
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product"
            }
        }
    ],
    role : {
        type : String,
        enum : ["customer" , "admin"],
        default : "customer"
    }


} ,{timestamps : true})



//pre-save hook to hash passwords before saving to the database

userSchema.pre("save",  async function(next) { // this is mongoose style of calling middleware , it is called on userSchema , pre(before) "save"
    if(!this.isModified("password")) return next(); //checks if the password field has been modified

    try {
        // A salt is like a secret ingredient that makes the password hash more secure.
        const salt = await bcrypt.genSalt(10);
         //then uses bcrypt.hash() to hash the password with the generated salt. This creates a secure pwd
        const hashedPassword = await bcrypt.hash(this.password , salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

// comparing the pwd

userSchema.methods.comparePassword = async function (pwd) {
    // this.password is the hashed password stored in the database
    const isMatch = await bcrypt.compare(pwd, this.password);
    return isMatch;
}

const User = mongoose.model("User" , userSchema);
// if yoou write this above the 2 fxns  they will not execute

export default User;