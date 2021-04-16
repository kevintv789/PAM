import "firebase/firestore";

import {
  PROPERTIES_DOC,
  PROPERTY_FINANCES_DOC,
  USER_DOC,
} from "shared/constants/databaseConsts";

import firebase from "firebase";

export default class PropertyService {
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

        propertyRef.update({ tenants, updatedOn: new Date() });
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
        updatedOn: new Date(),
      });
    });
  };
}
