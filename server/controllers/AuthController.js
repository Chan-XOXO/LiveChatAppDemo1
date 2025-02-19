import { response } from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

//Der Token besteht aus email, userID mit verschlüsselung durch JWT_KEY und ist für 3 Tage valide
const createToken = (email, userId) => {
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn: maxAge});
};

export const signup = async (request,response,next) => {
    //Versuche den User zu registrieren
    try {
        const {email, password} = request.body;

        //Wenn email oder passwort nicht eingegeben, dann gebe Fehler meldung aus
        if(!email || !password){
            return response.status(400).send("Email and Password is Required")
        }

        //Lege den User an
        const user = await User.create({email,password});

        //gebe den den Token als cookie zurück
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        //Gebe die durch den SignUp erzeugten Daten und Erfolgsnachricht zurück 
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });

    } catch (error) { 
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const login = async (request,response,next) => {
    //Versuche den User zu einzuloggen
    try {
        const {email, password} = request.body;

        //Wenn email oder passwort nicht eingegeben, dann gebe Fehler meldung aus
        if(!email || !password){
            return response.status(400).send("Email and Password is required.");
        }

        //Finde den User 
        const user = await User.findOne({email});
        if(!user) {
            return response.status(404).send("User with the given email not found.");
        }
        //Vergleiche den Passwort
        const auth = await compare(password, user.password);

        //Wenn der Passwort nicht übereinstimmt, gebe eine Fehlermeldung
        if (!auth) {
            return response.status(400).send("Password is incorrect.");
        }

        //gebe den den Token als cookie zurück
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        //Gebe die durch den Login "überprüften" Daten und Erfolgsnachricht zurück 
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });

    } catch (error) { 
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const getUserInfo = async (request,response,next) => {
    //Versuche den User zu einzuloggen
    try {
        //Suche den User durch seine ID und gebe Fehlermeldung wen dieser dadurch nicht gefunden wird
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("User with the given id not found.");
        }
       

        //Gebe die Userdaten zurück 
        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
        

    } catch (error) { 
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const updateProfile = async (request,response,next) => {
    //Versuche den User zu einzuloggen
    try {
        const {userId} = request;
        const {firstName, lastName, color} = request.body;
        //Suche den User durch seine ID und gebe Fehlermeldung wen dieser dadurch nicht gefunden wird
        
        if (!firstName || !lastName) {
            return response.status(400).send("Firstname, lastname and color is required.");
        }
       
        //Speichere die bei dem Profil erstellten bzw. geänderten Daten in userData
        const userData = await User.findByIdAndUpdate(userId, {
            firstName,lastName,color,profileSetup:true
        }, {new:true, runValidators:true});

        //Gebe die Userdaten zurück 
        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
        

    } catch (error) { 
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

//Add Profil Image not done !!!
export const addProfileImage= async (request,response,next) => {
    //Versuche den User zu einzuloggen
    try {
        if(!request.file) {
            return response.status(400).send("File is required.");
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync(request.file.path,fileName);

        const updateUser = await User.findByIdAndUpdate(request.userId,{image:fileName}, {new:true,runValidators:true});
        
        //Gebe die Userdaten zurück 
        return response.status(200).json({
               
            image: updateUser.image,
            
        });
        

    } catch (error) { 
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};


//Add Profil Image not done !!!
export const removeProfileImage= async (request,response,next) => {
    //Versuche den User zu einzuloggen
    try {
        const {userId} = request;
        const user = await User.findById(userId);

        if (!user){
              return response.status(404).send("User not found.");
        }

        if(user.image) {
            unlinkSync(user.image);
        }
        
        user.image=null;
        await user.save();
       
        //Speichere die bei dem Profil erstellten bzw. geänderten Daten in userData
        

        //Gebe die Userdaten zurück 
        return response.status(200).send("Profile Image removed successfully.");
        

    } catch (error) { 
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};


export const logout= async (request,response,next) => {
    
    try {
        

        response.cookie("jwt","",{maxAge:1, secure:true,sameSite:"None"});
        return response.status(200).send("Logout successfully.");
        

    } catch (error) { 
        
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};