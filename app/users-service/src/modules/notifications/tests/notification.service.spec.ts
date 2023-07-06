import { NotificationType } from '@fiu-fit/common/dist/interfaces/notification-type';
import { Test, TestingModule } from '@nestjs/testing';
import {
  GoalNotification,
  MessageNotification,
  Role,
  User
} from '@prisma/client';
import { admin } from '../../../firebase/firebase';
import { PrismaService } from '../../../prisma.service';
import { UserDTO } from '../../user/dto';
import { UserService } from '../../user/user.service';
import { GoalNotificationDTO } from '../dto/goal-notification.dto';
import { MessageNotificationDTO } from '../dto/message-notification.dto';
import { NotificationService } from '../notification.service';

const authMock = {
  deleteUser:    jest.fn(),
  verifyIdToken: jest.fn(
    _ =>
      ({
        email: 'default'
      } as any)
  )
};

const messagingMock = {
  // eslint-disable-next-line require-await
  send: jest.fn(async () => 'hola')
};

jest.mock('firebase-admin', () => {
  return {
    auth:          jest.fn(() => authMock),
    initializeApp: jest.fn().mockReturnThis(),
    messaging:     jest.fn(() => messagingMock),
    credential:    {
      cert: jest.fn().mockReturnThis()
    }
  };
});

const newUser: UserDTO = {
  firstName:      'test',
  lastName:       'test',
  email:          'test@gmail.com',
  role:           Role.Admin,
  bodyWeight:     100,
  interests:      [],
  phoneNumber:    '',
  uid:            'test',
  profilePicture: 'test',
  deviceToken:    'test'
};

const defaultUser: User = {
  ...newUser,
  id:                1,
  createdAt:         new Date(),
  confirmationPIN:   '',
  confirmed:         false,
  blocked:           false,
  blockedAt:         null,
  federatedIdentity: false
};

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide:  PrismaService,
          useValue: {
            goalNotification: {
              create:   jest.fn(),
              findMany: jest.fn(),
              delete:   jest.fn()
            },
            messageNotification: {
              create:     jest.fn(),
              findMany:   jest.fn(),
              deleteMany: jest.fn()
            }
          }
        },
        {
          provide:  UserService,
          useValue: {
            getUserById: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGoalNotification', () => {
    it('should create a goal notification', async () => {
      const goalNotificationDto = new GoalNotificationDTO();
      goalNotificationDto.userId = 1;
      goalNotificationDto.goalId = 1;
      goalNotificationDto.goalTitle = 'test goal';

      const createdGoalNotification: GoalNotification = {
        ...goalNotificationDto,
        id:         1,
        receivedAt: new Date()
      };

      jest
        .spyOn(prismaService.goalNotification, 'create')
        .mockResolvedValue(createdGoalNotification);

      const result = await service.createGoalNotification(goalNotificationDto);

      expect(result).toBe(createdGoalNotification);
      expect(prismaService.goalNotification.create).toHaveBeenCalledWith({
        data: goalNotificationDto
      });
    });
  });
  describe('createMessageNotification', () => {
    it('should create a message notification and send a push notification', async () => {
      const messageNotificationDto = new MessageNotificationDTO();

      messageNotificationDto.userId = 1;
      messageNotificationDto.senderId = 1;
      messageNotificationDto.senderName = 'test name';

      const createdMessageNotification: MessageNotification = {
        id:         1,
        receivedAt: new Date(),
        ...messageNotificationDto
      };
      //   const user = {}; // Define the user object
      const senderId = 1;
      const senderName = 'test name';

      jest
        .spyOn(prismaService.messageNotification, 'create')
        .mockResolvedValue(createdMessageNotification);
      jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue({ ...defaultUser, location: [3, 3] });
      jest.spyOn(service, 'sendPushMessageNotification');

      const result = await service.createMessageNotification(
        messageNotificationDto
      );

      expect(result).toBe(createdMessageNotification);
      expect(prismaService.messageNotification.create).toHaveBeenCalledWith({
        data: messageNotificationDto
      });
      expect(userService.getUserById).toHaveBeenCalledWith(
        messageNotificationDto.userId
      );
      expect(service.sendPushMessageNotification).toHaveBeenCalledWith(
        defaultUser.deviceToken,
        senderId,
        senderName
      );
    });
  });

  describe('sendPushMessageNotification', () => {
    it('should send a push notification', () => {
      const token = 'device-token';
      const senderId = 1;
      const senderName = 'John Doe';

      jest.spyOn(admin.messaging(), 'send');

      service.sendPushMessageNotification(token, senderId, senderName);

      expect(admin.messaging().send).toHaveBeenCalledWith({
        notification: {
          title: 'Mensaje nuevo',
          body:  `${senderName} te envió un mensaje!`
        },
        data: {
          senderId: senderId.toString(),
          type:     NotificationType.NewMessage.toString()
        },
        token
      });
    });
  });
  describe('getGoalNotifications', () => {
    it('should get goal notifications for a user', async () => {
      const userId = 1;

      const goalNotificationDto1 = new GoalNotificationDTO();
      goalNotificationDto1.userId = 1;
      goalNotificationDto1.goalId = 1;
      goalNotificationDto1.goalTitle = 'test goal';

      const createdGoalNotification1: GoalNotification = {
        ...goalNotificationDto1,
        id:         1,
        receivedAt: new Date()
      };

      const goalNotificationDto2 = new GoalNotificationDTO();
      goalNotificationDto2.userId = 2;
      goalNotificationDto2.goalId = 2;
      goalNotificationDto2.goalTitle = 'test goal 2';

      const createdGoalNotification2: GoalNotification = {
        ...goalNotificationDto2,
        id:         2,
        receivedAt: new Date()
      };

      const goalNotifications = [
        createdGoalNotification1,
        createdGoalNotification2
      ]; // Define the goal notifications array

      jest
        .spyOn(prismaService.goalNotification, 'findMany')
        .mockResolvedValue(goalNotifications);

      const result = await service.getGoalNotifications(userId);

      expect(result).toBe(goalNotifications);
      expect(prismaService.goalNotification.findMany).toHaveBeenCalledWith({
        where:   { userId },
        orderBy: { receivedAt: 'desc' }
      });
    });
  });

  describe('getMessageNotifications', () => {
    it('should get message notifications for a user', async () => {
      const userId = 1;
      const messageNotificationDto1 = new MessageNotificationDTO();

      messageNotificationDto1.userId = 1;
      messageNotificationDto1.senderId = 1;
      messageNotificationDto1.senderName = 'test name';

      const createdMessageNotification1: MessageNotification = {
        id:         1,
        receivedAt: new Date(),
        ...messageNotificationDto1
      };

      const messageNotificationDto2 = new MessageNotificationDTO();

      messageNotificationDto2.userId = 2;
      messageNotificationDto2.senderId = 2;
      messageNotificationDto2.senderName = 'test name 2';

      const createdMessageNotification2: MessageNotification = {
        id:         2,
        receivedAt: new Date(),
        ...messageNotificationDto2
      };

      const messageNotifications = [
        createdMessageNotification1,
        createdMessageNotification2
      ]; // Define the message notifications array

      jest
        .spyOn(prismaService.messageNotification, 'findMany')
        .mockResolvedValue(messageNotifications);

      const result = await service.getMessageNotifications(userId);

      expect(result).toBe(messageNotifications);
      expect(prismaService.messageNotification.findMany).toHaveBeenCalledWith({
        where:   { userId },
        orderBy: { receivedAt: 'desc' }
      });
    });
  });

  describe('deleteGoalNotification', () => {
    it('should delete a goal notification', async () => {
      const goalId = 1;
      const deletedGoalNotificationDto = new GoalNotificationDTO();
      deletedGoalNotificationDto.userId = 1;
      deletedGoalNotificationDto.goalId = 1;
      deletedGoalNotificationDto.goalTitle = 'test goal';

      const deletedGoalNotification: GoalNotification = {
        ...deletedGoalNotificationDto,
        id:         1,
        receivedAt: new Date()
      };

      jest
        .spyOn(prismaService.goalNotification, 'delete')
        .mockResolvedValue(deletedGoalNotification);

      const result = await service.deleteGoalNotification(goalId);

      expect(result).toBe(deletedGoalNotification);
      expect(prismaService.goalNotification.delete).toHaveBeenCalledWith({
        where: { goalId }
      });
    });
  });
});
