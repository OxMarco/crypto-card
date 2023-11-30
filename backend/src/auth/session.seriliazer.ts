import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSeriallizer extends PassportSerializer {
    serializeUser(user: any, done: Function) {
        done(null, user)
    }
    deserializeUser(payload: any, done: Function) {
        done(null, payload)
    }
}