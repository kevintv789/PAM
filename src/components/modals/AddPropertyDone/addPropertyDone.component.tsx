import { Button, Container, LoadingIndicator, Text } from "components/common";
import { Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { constants, theme } from "shared";

import AuthService from "services/auth.service";
import { getUser } from "reducks/modules/user";
import { useDispatch } from "react-redux";

const AddPropertyDoneComponent = (props: any) => {
  const { navigation } = props;
  const authService = new AuthService();
  const dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = () => {
    setisLoading(true);
    authService
      .getCurrentUserPromise()
      .then((res) => {
        dispatch(getUser(res.data()));
        navigation.goBack();
      })
      .catch((error) => console.log("ERROR in retrieving user data: ", error))
      .finally(() => setisLoading(false));
  };

  return (
    <Container center color="accent" style={styles.mainContainer}>
      <Image
        source={require("assets/icons/thumbs_up.png")}
        style={styles.image}
      />
      <Text offWhite size={24} bold style={styles.bigText}>
        You're All Set!
      </Text>
      <Text offWhite light center style={styles.bigText}>
        You can track all your properties on the Home tab. If you have any
        questions about how any of this works, don’t hesitate to contact us at{" "}
        {/* TODO -- maybe make this into a button, or a clickable link */}
        <Text tertiary semibold>
          {constants.SUPPORT_EMAIL}
        </Text>
        !
      </Text>
      <Button
        color="secondary"
        style={styles.button}
        onPress={() => handleSubmit()}
      >
        <Text offWhite center bold style={{ alignSelf: "center" }}>
          {!isLoading && "Take Me Home"}
          {isLoading && (
            <LoadingIndicator size="small" color={theme.colors.offWhite} />
          )}
        </Text>
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: theme.sizes.padding,
  },
  image: {
    width: 172,
    height: 172,
  },
  bigText: {
    marginTop: theme.sizes.padding * 1.5,
  },
  button: {
    marginTop: theme.sizes.padding * 1.5,
  },
});

export default AddPropertyDoneComponent;
