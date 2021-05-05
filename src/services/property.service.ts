import "firebase/firestore";

import {
  PROPERTIES_DOC,
  PROPERTY_FINANCES_DOC,
  TENANTS_DOC,
  USER_DOC,
} from "shared/constants/databaseConsts";

import CommonService from "services/common.service";
import firebase from "firebase";
import { remove } from "lodash";

export default class PropertyService {
  private commonService = new CommonService();

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

  /**
   * This function removes all property references from tenant collection
   * @param propertyId
   */
  handleRemovePropertyFromTenant = (propertyId: string) => {
    return this.commonService
      .getRefsFrom(TENANTS_DOC, "propertyId", propertyId)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const batch = firebase.firestore().batch();

          batch.delete(doc.ref);
          return batch.commit();
        });
      });
  };

  /**
   * This function removes all property references from property finances collection
   * @param propertyId
   */
  handleRemovePropertyFromFinances = (propertyId: string) => {
    return this.commonService
      .getRefsFrom(PROPERTY_FINANCES_DOC, "propertyId", propertyId)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const batch = firebase.firestore().batch();

          batch.delete(doc.ref);
          return batch.commit();
        });
      });
  };

  /**
   * This function removes all property references from property collection
   * @param propertyId
   */
  handleRemoveProperty = (propertyId: string) => {
    return this.commonService
      .getRefsFrom(PROPERTIES_DOC, "id", propertyId)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const batch = firebase.firestore().batch();

          batch.delete(doc.ref);
          return batch.commit();
        });
      });
  };

  /**
   * This function sets a new array for the user
   * @param propertyId
   */
  handleRemovePropertyFromUser = (propertyId: string, userData: any) => {
    const properties = userData.properties;
    remove(properties, (p: string) => p === propertyId);

    // Sets the new properties array
    return firebase
      .firestore()
      .collection(USER_DOC)
      .doc(firebase.auth().currentUser?.uid)
      .update({ properties });
  };
}
