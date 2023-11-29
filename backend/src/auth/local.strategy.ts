import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/dtos/login-user";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(loginUserDto: LoginUserDto) {
        const user = await this.authService.login(loginUserDto);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}