import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userID) =>{
    const accessToken = jwt.sign({userID} , process.env.ACCESS_TOKEN_SECRET , {expiresIn : "15m"});

    const refreshToken = jwt.sign({userID},process.env.REFRESH_TOKEN_SECRET , {expiresIn : "7d"});

    return {accessToken , refreshToken};
};

const storeRefreshToken = async (userId , refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken , "EX", 7*24*60*60); // 7 days
};

const setCookies = (res, accessToken , refreshToken) => {
    res.cookie("accessToken" , accessToken,{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : 15*60*1000
    });

    res.cookie("refreshToken" , refreshToken , {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : 7*24*60*60*1000
    });
}

export const signup = async(req, res) => {
    const {name , email, password} = req.body;

    try {
        const userExists = await  User.findOne({email});
        if(userExists) return res.status(400).json({message : "User already Exists"});

        const user = await User.create({name,email,password}); // the pre hook activates before saving

        //authenticate the user using jwt
        const {accessToken, refreshToken} = generateToken(user._id);
        await storeRefreshToken(user._id , refreshToken);
        setCookies(res , accessToken , refreshToken);

        res.status(201).json(
            {
                _id :user.id,
                name :user.name,
                email : user.email,
                role : user.role,
            }
        );
    } catch (error) {
         console.log("Error in Signup Controller: ", error);
        res.status(500).json({message : error.message});
    }
}

export const login = async(req, res) => {
    try {
        const {email,password} = req.body;
        const  user = await User.findOne({email});


        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken} = generateToken(user._id);
            await storeRefreshToken(user._id , refreshToken);
            setCookies(res , accessToken , refreshToken);

            res.status(200).json({
                _id : user.id,
                name : user.name,
                email : user.email,
                role : user.role
            });

        }else{
            res.status(401).json({message : "Invalid Credentials"});
        }
    } catch (error) {
        console.log("Error in Login Controller: ", error);
        res.status(500).json({message : error.message});
    }
}

export const logout = async(req, res) => {
    try {
        console.log("Logout cont reached");
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decodedPayload = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);  // this returrns an object
            await redis.del(`refresh_token:${decodedPayload.userID}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        console.log("Logout cont executed");

        res.status(200).json({message : "Logout is successful"});
    } catch (error) {
         console.log("Error in Logout Controller: ", error);
        res.status(500).json({message : error.message});
    }
}

export const refreshToken = async (req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;;

        if(!refreshToken) {
            return res.status(401).json({message : "No refresh token found"});
        }

        const decodedPayload = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decodedPayload.userID}`);

        if(refreshToken !== storedToken){
            return res.status(401).json({message : "Invalid refresh token"});
        }

        const accessToken = jwt.sign({userID : decodedPayload.userID} , process.env.ACCESS_TOKEN_SECRET , {expiresIn : "15m"});

        res.cookie("accessToken" , accessToken , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            "sameSite" : "strict",
            "maxAge" : 15*60*1000
        })

        res.status(200).json({message : "Refresh token has refreshed Access Token"});
    } catch (error) {
        console.log("Error in RefreshToken Controller: ", error);;
        res.status(500).json({message : error.message});
    }

}


export const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.json(req.user);
    } catch (error) {
        console.log("Error in getProfile Controller: ", error);
        res.status(500).json({ message: error.message });
    }
}