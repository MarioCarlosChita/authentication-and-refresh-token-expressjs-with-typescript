
import bcrypt from "bcrypt";

export class PasswordService {

    static async encryptpass(password: string): Promise<string> {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isPasswordValid = await bcrypt.compare(
            password,
            hashedPassword
        );
        return isPasswordValid;
    }
} 