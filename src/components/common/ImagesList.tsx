import { FlatList, Image, StyleSheet } from "react-native";

import Container from "./Container";
import React from "react";

const ImagesList = () => {
  return (
    <Container>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        horizontal
        data={[
          {
            uri:
              "file:///var/mobile/Containers/Data/Application/D3413086-9217-4A79-A0AE-1CD5C53EF05F/Library/Caches/ExponentExperienceData/%2540kevintv789%252FPAM/ImagePicker/6EFBBF90-B776-425D-9557-5D437A109FFA.jpg",
          },
        ]}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
        keyExtractor={(item: any) => item}
      />
    </Container>
  );
};

export default ImagesList;

const styles = StyleSheet.create({
  image: {
    width: 165,
    height: 165,
    marginHorizontal: 10,
    marginTop: 10,
  },
});
