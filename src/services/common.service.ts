import { doesElementExistArrObj } from "shared/Utils";
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
  handleCreateWithImages = (payload: any, ref: any, images: any[], type: string) => {
    const imagesUri: object[] = [];

    images.forEach((image, index) => {
      imagesUri.push({
        downloadPath: "",
        name: `images/${type}/${ref.id}-${index}`,
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
   * This function handles any updates to the firebase documents with images
   * @param payload
   * @param docId
   * @param collection
   */
  handleUpdateWithImages = (payload: any, docId: string, collection: string, images: any[], type: string) => {
    const imagesUri: object[] = [];

    images.forEach((image, index) => {
      let imageName = image.name;

      if (imageName == null) {
        imageName = `images/${type}/${docId}-${index}`;
        let doesNameExist =
          doesElementExistArrObj(images, "name", imageName) || doesElementExistArrObj(imagesUri, "name", imageName);
        let increment = 1;

        while (doesNameExist) {
          imageName = `images/${type}/${docId}-${index + increment}`;
          doesNameExist =
            doesElementExistArrObj(images, "name", imageName) || doesElementExistArrObj(imagesUri, "name", imageName);
          increment++;
        }
      }

      imagesUri.push({
        name: imageName,
        uri: image.uri,
        downloadPath: image.downloadPath != null ? image.downloadPath : "",
      });
    });

    return firebase
      .firestore()
      .collection(collection)
      .doc(docId)
      .set({ ...payload, id: docId, updatedOn: new Date(), images: imagesUri });
  };

  /**
   * This function handles the updating of a single field within a collection
   * @param collection
   * @param docId
   * @param fieldToUpdate
   */
  handleUpdateSingleField = (collection: string, docId: string, fieldToUpdate: any) => {
    return firebase.firestore().collection(collection).doc(docId).update(fieldToUpdate);
  };

  /**
   * This function takes in a collection, property of an object and a particular data type
   * that will be used within the where() clause
   * @param collection
   * @param property
   * @param dataToQuery
   */
  getRefsFrom = (collection: string, property: string, dataToQuery: any) => {
    return firebase.firestore().collection(collection).where(property, "==", dataToQuery);
  };

  /**
   * This function handles uploading multiple images to firebase storage
   * using an array of images
   * @param images
   */
  handleUploadImages = async (images: any[], id: string, type: string) => {
    const oldImages = images.filter((img: any) => img.name != null);
    const newImages = images.filter((img: any) => img.name == null);

    // Reconstruct the images array to make new images last b/c storage shouldn't care about ordering
    const combinedImages = oldImages.concat(newImages);

    return await Promise.all(
      combinedImages.map(async (image, index) => {
        let imageName = image.name;

        if (imageName == null) {
          // only add to storage if the image isn't already in storage
          const imageUri: string = image.uri;
          const response = await fetch(imageUri);
          const blob = await response.blob();

          imageName = `images/${type}/${id}-${index}`;

          const ref = firebase.storage().ref().child(imageName);

          return await ref.put(blob);
        }
      })
    );
  };

  /**
   * This function retrieves the image's URI given parameters
   * @param images
   */
  getImageDownloadUri = async (images: any[]) => {
    const imageDownloadUrls = images.map(async (image) => {
      const ref = firebase.storage().ref().child(image.name);
      let url = await ref
        .getDownloadURL()
        .then((url) => url)
        .catch((error) => console.log("ERROR can't retrieve image: ", error));

      return { uri: url };
    });

    return await Promise.all(imageDownloadUrls);
  };

  getSingleImageDownloadPath = async (image: any) => {
    const ref = firebase.storage().ref().child(image.name);
    let url = await ref
      .getDownloadURL()
      .then((url) => url)
      .catch((error) => console.log("ERROR can't retrieve image: ", error));

    return url;
  };

  /**
   * This function takes in an array of images and removes them one by one
   * @param images
   */
  deleteStorageFile = async (images: any[]) => {
    return await Promise.all(
      images.map(async (image) => {
        const ref = firebase.storage().ref().child(image.name);
        return await ref.delete();
      })
    );
  };

  /**
   * This function deletes a single item from the storage given the file name
   * @param fileName
   */
  deleteSingleItemFromStorage = async (fileName: string) => {
    const ref = firebase.storage().ref().child(fileName);
    return await ref.delete();
  };
}
