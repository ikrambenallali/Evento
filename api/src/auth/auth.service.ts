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

        console.log('🔍 User trouvé:', user);
        console.log('🔍 user._id:', user?._id);
        console.log('🔍 Type de user._id:', typeof user?._id);

        if (user && await bcrypt.compare(pass, user.password)) {
            const userId = user._id?.toString() || String(user._id);
            
            console.log('✅ userId après conversion:', userId);
            console.log('✅ Type de userId:', typeof userId);
            
            const result = {
                id: userId,        
                email: user.email,
                role: user.role,
            };
            
            console.log('✅ Objet retourné par validateUser:', result);
            return result;
        }
        return null;
    }

    async login(user: any) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 DEBUT login() - User reçu:', user);
        console.log('🔍 user.id:', user?.id);
        console.log('🔍 Type de user.id:', typeof user?.id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const payload = { 
            sub: user.id,
            email: user.email, 
            role: user.role 
        };
        
        console.log('🎫 Payload AVANT signature:', payload);
        console.log('🎫 payload.sub:', payload.sub);
        
        const token = this.jwtService.sign(payload);
        
        console.log('🎫 Token généré:', token);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
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

        console.log('🎫 Register - Payload:', payload);

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