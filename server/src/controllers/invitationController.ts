import type { Request, Response } from 'express';
import {
   createInvitationModel,
   getInvitationByTokenModel,
   setInvitationStatusModel,
} from '../models/invitationModel';
import {
   addApartmentMemberModel,
   isUserMemberOfApartment,
   getApartmentByIdModel,
} from '../models/apartmentModel';
import { getApartmentsForUserModel, setCurrentApartmentModel } from '../models/authModel';
import { getCimerByEmailModel } from '../models/cimerModel';
import { sendInviteEmail } from '../lib/email';
import type { AuthUser } from '../middleware/auth';

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

export const createInvitationController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const apartmentId = (req as any).adminApartmentId as number;
      const { email, send_email } = req.body;
      if (!email || typeof email !== 'string' || !email.trim()) {
         return res.status(400).json({ message: 'Email is required.' });
      }
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await getCimerByEmailModel(normalizedEmail);
      if (existingUser) {
         const alreadyMember = await isUserMemberOfApartment(existingUser.id, apartmentId);
         if (alreadyMember) {
            return res.status(409).json({
               message: 'This email is already a member of this apartment.',
            });
         }
      }
      const { token, expiresAt } = await createInvitationModel(
         apartmentId,
         normalizedEmail,
         user.id,
      );
      const inviteLink = `${FRONTEND_ORIGIN}/join?token=${token}`;
      let emailSent = false;
      let emailError: string | undefined;
      if (send_email === true) {
         const apartment = await getApartmentByIdModel(apartmentId);
         const inviterName =
            [user.name, user.lastname].filter(Boolean).join(' ').trim() || undefined;
         const result = await sendInviteEmail(
            normalizedEmail,
            inviteLink,
            apartment?.name,
            inviterName,
         );
         emailSent = result.success;
         if (!result.success && result.error) emailError = result.error;
      }
      return res.status(201).json({
         message: 'Invitation created.',
         inviteLink,
         token,
         expiresAt,
         email: normalizedEmail,
         emailSent,
         ...(emailError && { emailError }),
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getInvitationByTokenController = async (req: Request, res: Response) => {
   try {
      const token = req.params.token;
      if (!token) {
         return res.status(400).json({ message: 'Token is required.' });
      }
      const invitation = await getInvitationByTokenModel(token);
      if (!invitation) {
         return res.status(404).json({ message: 'Invitation not found.' });
      }
      if (invitation.status !== 'pending') {
         return res
            .status(400)
            .json({ message: 'This invitation has already been used or expired.', invitation });
      }
      const now = new Date();
      const expiresAt = new Date(invitation.expires_at);
      if (expiresAt < now) {
         await setInvitationStatusModel(invitation.id, 'expired');
         return res.status(400).json({
            message: 'This invitation has expired.',
            invitation: { ...invitation, status: 'expired' },
         });
      }
      return res.status(200).json({
         apartmentName: invitation.apartment_name,
         inviterName:
            `${invitation.inviter_name || ''} ${invitation.inviter_lastname || ''}`.trim(),
         email: invitation.email,
         expiresAt: invitation.expires_at,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const acceptInvitationController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const { token } = req.body;
      if (!token || typeof token !== 'string') {
         return res.status(400).json({ message: 'Token is required.' });
      }
      const invitation = await getInvitationByTokenModel(token);
      if (!invitation) {
         return res.status(404).json({ message: 'Invitation not found.' });
      }
      if (invitation.status !== 'pending') {
         return res
            .status(400)
            .json({ message: 'This invitation has already been used or expired.' });
      }
      const now = new Date();
      if (new Date(invitation.expires_at) < now) {
         await setInvitationStatusModel(invitation.id, 'expired');
         return res.status(400).json({ message: 'This invitation has expired.' });
      }
      if (invitation.email !== user.email.toLowerCase()) {
         return res
            .status(403)
            .json({ message: 'This invitation was sent to a different email address.' });
      }
      await addApartmentMemberModel(invitation.apartment_id, user.id, 'member');
      await setInvitationStatusModel(invitation.id, 'accepted');
      await setCurrentApartmentModel(user.id, invitation.apartment_id);
      const apartments = await getApartmentsForUserModel(user.id);
      return res.status(200).json({
         message: 'You have joined the apartment.',
         currentApartmentId: invitation.apartment_id,
         apartments,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};
