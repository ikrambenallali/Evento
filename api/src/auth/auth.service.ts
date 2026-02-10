import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor( private usersService: UsersService, private jwtService: JwtService) { }
    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const userId = user._id?.toString() || String(user._id);
            const result = {
                id: userId,        
                email: user.email,
                role: user.role,
            };
            return result;
        }
        return null;
    }
    
    async login(user: any) {
        const payload = { 
            sub: user.id,
            email: user.email, 
            role: user.role 
        };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
        };
    }

    async register(userData: any) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.usersService.create({ ...userData, password: hashedPassword });
        const userId = user._id?.toString() || String(user._id);
        const payload = {
            sub: userId,
            email: user.email,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: userId,
                email: user.email,
                role: user.role,
            },
        };
    }
}