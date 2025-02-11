import { AuthModule } from './auth/auth.module';
import { EnvModule } from './env/env.module';
import { KeyModule } from './key/key.module';
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
];
