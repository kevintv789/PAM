import { User } from "models/User.model";
import firebase from "firebase";

class AuthService {
  handleSignUpWithEmailAndPassword = (user: User, navigation: any) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password);
  };

  handleSignInWithEmailAndPassword = (user: User) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
  };
}

export default AuthService;
