import passport from "passport";
import { OIDCStrategy } from "passport-azure-ad";
import { prisma } from "../shared/prisma";

passport.use(
  new OIDCStrategy(
    {
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      passReqToCallback: false,
      responseType: "code",
      redirectUrl: "http://localhost:3000/login",
      allowHttpForRedirectUrl: true,
      responseMode: "query",
      scope: ["email", "profile"],
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    },
    async (userData, cb) => {
      try {
        console.log(userData);

        const email = userData._json.email;
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          // create user
          const user = await prisma.user.create({
            data: {
              email: email,
              profile: {
                create: {
                  name: userData._json.name,
                },
              },
            },
          });
          return cb(null, user.id);
        }
        return cb(null, user.id);
      } catch (e) {
        return cb(e);
      }
    }
  )
);
