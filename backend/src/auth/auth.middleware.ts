import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as firebase from "firebase-admin";
import axios from "axios";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor(private configService: ConfigService) {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(this.getConfig()),
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

  private getConfig() {
    return {
      type: this.configService.get("firebase_type"),
      projectId: this.configService.get("firebase_project_id"),
      privateKeyId: this.configService.get("firebase_private_key_id"),
      privateKey: this.configService.get("firebase_private_key"),
      clientEmail: this.configService.get("firebase_client_email"),
      clientId: this.configService.get("firebase_client_id"),
      authUri: this.configService.get("firebase_auth_uri"),
      tokenUri: this.configService.get("firebase_token_uri"),
      authProviderX509CertUrl: this.configService.get("firebase_auth_provider_x509_cert_url"),
      clientC509Url: this.configService.get("firebase_client_x509_cert_url"),
    };
  }

  use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers.authorization;

    if (token === null || token === "" || typeof token === "undefined") next();
    else {
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace("Bearer ", ""))
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
    }
  }
}
