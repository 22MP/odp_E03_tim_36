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

import { IMessageRepository } from './Domain/repositories/messages/IMessageRepository';
import { MessageRepository } from './Database/repositories/messages/MessageRepository';

import { MessageService } from './Services/message/MessageService';
import { MessageController } from './WebAPI/controllers/MessageController';
import { IMessageService } from './Domain/services/messages/IMessageService';

require('dotenv').config();

const app = express();

app.use(cors());

// Serve avatars statically
app.use('/uploads/slike', express.static(path.join(process.cwd(), "uploads/slike")));

// Only use express.json for non-file-upload routes
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const messageRepository: IMessageRepository = new MessageRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const messageService : IMessageService = new MessageService(messageRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const messageController = new MessageController(messageService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', messageController.getRouter());

export default app;