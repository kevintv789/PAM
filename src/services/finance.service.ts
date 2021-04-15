import firebase from "firebase";

export default class FinanceService {
  /**
   * This function's primary focus is to create a new document
   * so that the app can retrieve its ID to use elsewhere
   */
  createNewDocId = (collection: string) => {
    return firebase.firestore().collection(collection).doc();
  };

  /**
   * This function literally adds a new document object onto the database
   * It will first destructure all of its properties with the 3 dots
   * Without destructuring, the new property object will have the 'payload'
   * as the top key
   * @param payload
   */
  handleCreate = (payload: any, ref: any) => {
    return ref.set({
      ...payload,
      id: ref.id,
    });
  };
}
