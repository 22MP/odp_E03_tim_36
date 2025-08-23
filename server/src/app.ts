import express from 'express';
import cors from 'cors';
import path from "path";
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Database/repositories/users/UserRepository';
import { AuthController } from './WebAPI/controllers/AuthController';
import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';
import { UserController } from './WebAPI/controllers/UserController';

require('dotenv').config();

const app = express();

app.use(cors());

// Serve avatars statically
app.use('/uploads/avatars', express.static(path.join(process.cwd(), "src/uploads/avatars")));

// Only use express.json for non-file-upload routes
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());

export default app;