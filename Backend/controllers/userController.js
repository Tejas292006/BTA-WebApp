import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../configs/prismaClient.js";


export const registerUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const existuser = await prisma.user.findUnique({ where: { username } });
        const existemail = await prisma.user.findUnique({ where: { email } });
        if (existuser || existemail) {
            throw new Error("user is already exist")
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedpassword,
            }
        });

        res.send({
            success: true,
            message: "user registered sucessfully"
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        }
        )
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                throw new Error("invalid Email or password");
            }
        }
        else {
            throw new Error("user not found");
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, `${process.env.SECRET}`, { expiresIn: "24h" });

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
            success: true,
            message: "login sucessfully",
            user: userWithoutPassword,
            token
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        const { password: _, ...userWithoutPassword } = user;
        res.send({
            success: true,
            message: "User Fetched Successfully",
            data: userWithoutPassword,
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
}

export const uploadProfileImage = async (req, res)=> {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file received" });
        }
        const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(200).json({
            success: true,
            message: "Your Image Uploaded Successfully!",
            url,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error uploading image", error: error.message });
    }
};
export const updateUser = async (req,res,next)=>{
    try {
        const userId = req.params.id;
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password,salt);

       const user = await prisma.user.update({
            where: { id: userId },
            data: { ...req.body, password: hashedpassword }
        })
        if(user) {
            res.send("user updated successfully")}
        if(!user) res.send("user not found")
      } catch (error) {
        res.send(error)
      }
    
}
