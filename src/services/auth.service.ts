import { USER_DOC } from "shared/constants/databaseConsts";
import { User } from "models/User.model";
import firebase from "firebase";

class AuthService {
  handleSignUpWithEmailAndPassword = (user: User) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password);
  };

  handleSignInWithEmailAndPassword = (user: User) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
  };

  /**
   * This method solely returns the current user's promise, so that
   * other components can run .then() and .catch() on it
   */
  getCurrentUserPromise = () => {
    return firebase
      .firestore()
      .collection(USER_DOC)
      .doc(firebase.auth().currentUser?.uid)
      .get();
  };
}

export default AuthService;
