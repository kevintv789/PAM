import { User } from "models/User.model";
import firebase from "firebase";

class SignUpService {
   handleSignUp = (user: User, navigation: any) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        console.log(result);
        navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        console.log("ERROR during sign up: ", error);
      });
  };
}

export default SignUpService;
