import { Injectable, NestMiddleware } from "@nestjs/common";
import * as firebase from "firebase-admin";

const firebaseConfig = {
  type: process.env.firebase_type,
  projectId: process.env.firebase_project_id,
  privateKeyId: process.env.firebase_private_key_id,
  privateKey: process.env.firebase_private_key,
  clientEmail: process.env.firebase_client_email,
  clientId: process.env.firebase_client_id,
  authUri: process.env.firebase_auth_uri,
  tokenUri: process.env.firebase_token_uri,
  authProviderX509CertUrl: process.env.firebase_auth_provider_x509_cert_url,
  clientC509Url: process.env.firebase_client_x509_cert_url,
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig),
      databaseURL: "",
    });
  }

  private accessDenied(url: string, res: any) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: "Access Denied.",
    });
  }

  use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers.authorization;
    console.log(token);

    if (token === null || token === "" || typeof token === "undefined") next();
    else {
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace("Bearer", ""))
        .then(async (decodedToken) => {
          const user = {
            email: decodedToken.email,
          };
          req["user"] = user;
          next();
        })
        .catch((error) => {
          console.error(error);
          this.accessDenied(req.url, res);
        });

      next();
    }
  }
}
