import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userData: any) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.usersService.create({ ...userData, password: hashedPassword });
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        };

    }

}
