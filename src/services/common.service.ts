import firebase from "firebase";

export default class CommonService {
  constructor() {}
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
      createdOn: new Date(),
    });
  };

  /**
   * This function creates a document with the image name so that we can
   * retrieve it from the storage easily
   * @param payload
   * @param ref
   * @param images
   */
  handleCreateWithImages = (payload: any, ref: any, images: any[]) => {
    const imagesUri: object[] = [];

    images.forEach((image, index) => {
      imagesUri.push({
        name: `images/${ref.id}-${index}`,
        uri: image.uri,
      });
    });

    return ref.set({
      ...payload,
      id: ref.id,
      createdOn: new Date(),
      images: imagesUri,
    });
  };

  /**
   * This function handles any updates to the firebase documents
   * @param payload
   * @param docId
   * @param collection
   */
  handleUpdate = (payload: any, docId: string, collection: string) => {
    return firebase
      .firestore()
      .collection(collection)
      .doc(docId)
      .set({ ...payload, id: docId, updatedOn: new Date() });
  };

  /**
   * This function takes in a collection, property of an object and a particular data type
   * that will be used within the where() clause
   * @param collection
   * @param property
   * @param dataToQuery
   */
  getRefsFrom = (collection: string, property: string, dataToQuery: any) => {
    return firebase
      .firestore()
      .collection(collection)
      .where(property, "==", dataToQuery);
  };

  /**
   * This function handles uploading multiple images to firebase storage
   * using an array of images
   * @param images
   */
  handleUploadImages = async (images: any[], propertyId: string) => {
    return images.forEach(async (image, index) => {
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const ref = firebase
        .storage()
        .ref()
        .child(`images/${propertyId}-${index}`);
      return ref.put(blob);
    });
  };

  /**
   * This function retrieves the image's URI given parameters
   * @param images
   */
  getImageDownloadUri = async (images: any[]) => {
    const imageDownloadUrls = images.map(async (image) => {
      const ref = firebase.storage().ref().child(image.name);
      const url = await ref
        .getDownloadURL()
        .then((url) => url)
        .catch((error) => console.log("ERROR can't retrieve image: ", error));

      return { uri: url };
    });
    
    return await Promise.all(imageDownloadUrls);
  };
}
