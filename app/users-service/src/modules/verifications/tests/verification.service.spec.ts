import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, RequestStatus } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../../prisma.service';
import { VerificationService } from '../verification.service';

const authMock = {
  deleteUser:    jest.fn(),
  verifyIdToken: jest.fn(
    _ =>
      ({
        email: 'default'
      } as any)
  )
};

jest.mock('firebase-admin', () => {
  return {
    auth:          jest.fn(() => authMock),
    initializeApp: jest.fn().mockReturnThis(),
    credential:    {
      cert: jest.fn().mockReturnThis()
    }
  };
});

describe('VerificationService', () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let verificationService: VerificationService;

  const defaultVerification = {
    id:         1,
    userId:     1,
    status:     RequestStatus.Pending,
    resourceId: 'testResourceId',
    receivedAt: new Date()
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, VerificationService]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    verificationService = await module.resolve(VerificationService);

    prisma = await module.resolve(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(verificationService).toBeDefined();
  });

  describe('addVerificationRequest', () => {
    it('should add verification request', async () => {
      prisma.verification.create.mockResolvedValue(defaultVerification);

      const result = await verificationService.addVerificationRequest(
        1,
        'testResourceId'
      );

      expect(result).toEqual(defaultVerification);
      expect(prisma.verification.create).toHaveBeenCalledWith({
        data: {
          userId:     1,
          resourceId: 'testResourceId',
          status:     RequestStatus.Pending
        }
      });
    });
  });

  describe('updateVerification', () => {
    it('should update verification request', async () => {
      const editedVerification = {
        ...defaultVerification,
        status: RequestStatus.Approved
      };

      prisma.verification.update.mockResolvedValue(editedVerification);

      const result = await verificationService.updateVerification(
        defaultVerification.id,
        editedVerification
      );

      expect(result).toEqual(editedVerification);
      expect(prisma.verification.update).toHaveBeenCalledWith({
        where: { id: defaultVerification.id },
        data:  editedVerification
      });
    });
  });

  describe('getVerificationRequests', () => {
    it('should update verification request', async () => {
      const verifications = [
        defaultVerification,
        {
          ...defaultVerification,
          id: 2
        },
        {
          ...defaultVerification,
          id: 3
        }
      ];
      prisma.verification.findMany.mockResolvedValue(verifications);
      prisma.verification.count.mockResolvedValue(verifications.length);

      const result = await verificationService.getVerificationRequests(
        RequestStatus.Pending
      );

      expect(result).toEqual({
        rows:  verifications,
        count: verifications.length
      });
      expect(prisma.verification.findMany).toHaveBeenCalledWith({
        where: { status: RequestStatus.Pending }
      });
      expect(prisma.verification.count).toHaveBeenCalledWith({
        where: { status: RequestStatus.Pending }
      });
    });
  });

  describe('getVerification', () => {
    it('should update verification request', async () => {
      prisma.verification.findUnique.mockResolvedValue(defaultVerification);

      const result = await verificationService.getVerification(
        defaultVerification.id
      );

      expect(result).toEqual(defaultVerification);
      expect(prisma.verification.findUnique).toHaveBeenCalledWith({
        where: { id: defaultVerification.id }
      });
    });
  });

  describe('getVerificationByUserId', () => {
    it('should update verification request', async () => {
      prisma.verification.findFirst.mockResolvedValue(defaultVerification);

      const result = await verificationService.getVerificationByUserId(
        defaultVerification.userId
      );

      expect(result).toEqual(defaultVerification);
      expect(prisma.verification.findFirst).toHaveBeenCalledWith({
        where: { userId: defaultVerification.userId }
      });
    });
  });
});
