import { AccommodationModule } from './accommodation/accommodation.module';
import { AuthModule } from './auth/auth.module';
import { CustomerDocumentModule } from './customer-document/customer-document.module';
import { CustomerModule } from './customer/customer.module';
import { CustomerService } from './customer/customer.service';
import { EnvModule } from './env/env.module';
import { KeyModule } from './key/key.module';
import { PassengerModule } from './passenger/passenger.module';
import { ProposalDayBayDayModule } from './proposal-day-by-day/proposal-day-by-day.module';
import { ProposalDestinationModule } from './proposal-destination/proposal-destination.module';
import { ProposalModule } from './proposal/proposal.module';
import { SegmentModule } from './segment/segment.module';
import { TicketModule } from './ticket/ticket.module';
import { UserAvatarModule } from './user-avatar/user-avatar.module';
import { UserForgotPasswordModule } from './user-forgot-password/user-forgot-password.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserRegisterModule } from './user-register/user-register.module';

export const featureModules = [
  UserRegisterModule,
  EnvModule,
  AuthModule,
  KeyModule,
  UserProfileModule,
  UserForgotPasswordModule,
  UserAvatarModule,
  ProposalModule,
  ProposalDestinationModule,
  ProposalDayBayDayModule,
  CustomerModule,
  CustomerDocumentModule,
  PassengerModule,
  TicketModule,
  SegmentModule,
  AccommodationModule,
];
