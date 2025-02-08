import { AuthModule } from "./auth/auth.module";
import { EnvModule } from "./env/env.module";
import { KeyModule } from "./key/key.module";
import { UserModule } from "./user/user.module";

export const featureModules = [UserModule, EnvModule, AuthModule, KeyModule]