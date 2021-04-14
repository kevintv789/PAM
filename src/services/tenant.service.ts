import { TENANTS_DOC } from "shared/constants/databaseConsts";
import firebase from "firebase";

export default class TenantService {
  /**
   * This function's primary focus is to create a new tenant document
   * so that the app can retrieve its ID to use elsewhere
   */
  createNewTenantId = () => {
    return firebase.firestore().collection(TENANTS_DOC).doc();
  };

  /**
   * This function literally adds a new tenant object onto the database
   * @param payload
   */
  handleCreateTenant = (payload: any, tenantDocRef: any) => {
    return tenantDocRef.set({
      ...payload,
      id: tenantDocRef.id,
    });
  };

  /**
   * This function handles updating the tenant object from the backend
   * @param payload 
   * @param tenantId 
   */
  handleUpdateTenant = (payload: any, tenantId: string) => {
    return firebase
      .firestore()
      .collection(TENANTS_DOC)
      .doc(tenantId)
      .set({ ...payload, id: tenantId });
  };
}
