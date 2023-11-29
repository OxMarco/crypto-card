import * as mongoose from "mongoose"

export const UserSchema = new mongoose.Schema(
    {
        ethereumAddress: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        countryCode: {
            type: String,
            required: true
        },
        poBox: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: false
        },
    },
    { timestamps: true }
)

export interface User extends mongoose.Document {
    _id: string,
    ethereumAddress: string,
    firstName: string,
    lastNamee: string,
    dob: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    countryCode: string,
    poBox: string,
    avatar?: string,
}

