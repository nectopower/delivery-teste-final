import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: string;
        name: string;
    }>;
    update(id: string, data: any): Promise<any>;
}
