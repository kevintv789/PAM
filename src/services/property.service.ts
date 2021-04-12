import "firebase/firestore";

import { PROPERTIES_DOC, USER_DOC } from "shared/constants/databaseConsts";

import firebase from "firebase";

export default class PropertyService {
  /**
   * This function's primary focus is to create a new property document
   * so that the app can retrieve its ID to use elsewhere
   */
  createNewPropertyId = () => {
    return firebase.firestore().collection(PROPERTIES_DOC).doc();
  };

  /**
   * This function literally adds a new property object onto the database
   * It will first destructure all of its properties with the 3 dots
   * Without destructuring, the new property object will have the 'payload'
   * as the top key
   * @param payload
   */
  handleCreateProperty = (payload: any, propertiesCollection: any) => {
    return propertiesCollection.set({
      ...payload,
      id: propertiesCollection.id,
    });
  };

  /**
   * This function updates a single property based on a given property Id
   * @param payload
   * @param propertyId
   */
  updateProperty = (payload: any, propertyId: string) => {
    return firebase
      .firestore()
      .collection(PROPERTIES_DOC)
      .doc(propertyId)
      .set({ ...payload, id: propertyId });
  };

  /**
   * This function's primary focus is to map a newly created tenant onto
   * an existing property
   * @param tenantId
   * @param curPropertyId
   */
  addTenantIdToProperty = (tenantId: string, curPropertyId: string) => {
    const propertyRef = firebase
      .firestore()
      .collection(PROPERTIES_DOC)
      .doc(curPropertyId);

    return propertyRef.get().then((res) => {
      if (res.exists) {
        const propertyData = res.data();
        const tenants = propertyData?.tenants;
        tenants.push(tenantId);

        propertyRef.update({ tenants });
      }
    });
  };

  /**
   * This function updates the current user object with the newly created property
   * This is necessary as all user objects store an array of properties, which is
   * used to query for a specific property for each unique user
   * @param propertyId - newly created property ID
   */
  updateUserDataWithProperty = (propertyId: any) => {
    // Retrieve properties array from users doc
    const currentUser = firebase
      .firestore()
      .collection(USER_DOC)
      .doc(firebase.auth().currentUser?.uid);

    return currentUser.get().then((snapshot: any) => {
      const properties = snapshot.data().properties;
      properties.push(propertyId);

      return currentUser.update({
        properties,
      });
    });
  };
}
