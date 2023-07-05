import { Test, TestingModule } from '@nestjs/testing';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { VerificationController } from '../verification.controller';
import { VerificationService } from '../verification.service';

describe('VerificationController', () => {
  let verificationService: VerificationService;
  let verificationController: VerificationController;

  const defaultVerification = {
    id:         1,
    userId:     1,
    status:     RequestStatus.Pending,
    resourceId: 'testResourceId',
    receivedAt: new Date()
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationController],
      providers:   [VerificationService, PrismaService]
    }).compile();

    verificationService = await module.resolve(VerificationService);
    verificationController = await module.resolve(VerificationController);
  });

  it('should be defined', () => {
    expect(verificationService).toBeDefined();
    expect(verificationController).toBeDefined();
  });

  describe('addVerification', () => {
    it('should create a verification', async () => {
      jest
        .spyOn(verificationService, 'addVerificationRequest')
        .mockResolvedValueOnce(defaultVerification);

      const result = await verificationController.addVerification(
        defaultVerification.userId,
        defaultVerification.resourceId
      );

      expect(verificationService.addVerificationRequest).toHaveBeenCalledWith(
        defaultVerification.userId,
        defaultVerification.resourceId
      );
      expect(result).toEqual(defaultVerification);
    });
  });

  describe('getVerifications', () => {
    it('should return all verifications', async () => {
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
      jest
        .spyOn(verificationService, 'getVerificationRequests')
        .mockResolvedValueOnce({
          rows:  verifications,
          count: verifications.length
        });

      const result = await verificationController.getVerifications();

      expect(
        verificationService.getVerificationRequests
      ).toHaveBeenCalledWith();
      expect(result).toEqual({
        rows:  verifications,
        count: verifications.length
      });
    });
  });

  describe('getVerification', () => {
    it('should return a verification matching the id', async () => {
      jest
        .spyOn(verificationService, 'getVerification')
        .mockResolvedValueOnce(defaultVerification);

      const result = await verificationController.getVerification(
        defaultVerification.id
      );

      expect(verificationService.getVerification).toHaveBeenCalledWith(
        defaultVerification.id
      );
      expect(result).toEqual(defaultVerification);
    });

    it('should throw a NotFoundException if no verification matches the id', () => {
      jest
        .spyOn(verificationService, 'getVerification')
        .mockResolvedValueOnce(null);

      expect(
        verificationController.getVerification(defaultVerification.id)
      ).rejects.toThrowError('Verification not found');
    });
  });

  describe('updateVerification', () => {
    const editedVerification = {
      ...defaultVerification,
      status: RequestStatus.Approved
    };

    it('should return a verification matching the id', async () => {
      jest
        .spyOn(verificationService, 'updateVerification')
        .mockResolvedValueOnce(editedVerification);

      const result = await verificationController.updateVerification(
        defaultVerification.id,
        editedVerification
      );

      expect(verificationService.updateVerification).toHaveBeenCalledWith(
        defaultVerification.id,
        editedVerification
      );
      expect(result).toEqual(editedVerification);
    });

    it('should throw a NotFoundException if no verification matches the id', () => {
      jest
        .spyOn(verificationService, 'updateVerification')
        .mockResolvedValueOnce(null);

      expect(
        verificationController.updateVerification(
          defaultVerification.id,
          editedVerification
        )
      ).rejects.toThrowError('Verification not found');
    });
  });

  describe('getVerificationByUserId', () => {
    it('should return a verification matching the userId', async () => {
      jest
        .spyOn(verificationService, 'getVerificationByUserId')
        .mockResolvedValueOnce(defaultVerification);

      const result = await verificationController.getVerificationByUserId(
        defaultVerification.userId
      );

      expect(verificationService.getVerificationByUserId).toHaveBeenCalledWith(
        defaultVerification.userId
      );
      expect(result).toEqual(defaultVerification);
    });

    it('should throw a NotFoundException if no verification matches the userId', () => {
      jest
        .spyOn(verificationService, 'getVerificationByUserId')
        .mockResolvedValueOnce(null);

      expect(
        verificationController.getVerificationByUserId(
          defaultVerification.userId
        )
      ).rejects.toThrowError('Verification not found');
    });
  });
});
