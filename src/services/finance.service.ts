import { PROPERTY_FINANCES_DOC } from "shared/constants/databaseConsts";
import firebase from "firebase";

export default class FinanceService {
  constructor() {}

  findAllDocsWithPropertyId = (propertyId: string) => {
    return firebase.firestore().collection(PROPERTY_FINANCES_DOC).where(propertyId, "==", propertyId).get();
  };
}
