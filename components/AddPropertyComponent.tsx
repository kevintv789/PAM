import { Container, HeaderDivider, Text } from "../components";
import { Dimensions, FlatList, Image, StyleSheet } from "react-native";
import React, { Component } from "react";

import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../shared/constants";

export default class AddPropertyComponent extends Component {
  renderImageSection = () => {
    return (
      <Container center>
        <TouchableOpacity>
          <Container
            style={styles.imageContainer}
            margin={[theme.sizes.padding]}
            flex={false}
            center
            middle
          >
            <Image
              source={require("../assets/icons/camera.png")}
              style={styles.cameraImage}
            />
          </Container>
        </TouchableOpacity>

        <Text offWhite light>
          Add property images or related documents
        </Text>
      </Container>
    );
  };

  renderPropertyTypeSelection = () => {
    const data = ["test1", "test2", "test3", "test4"];
    return (
      <Container flex={1.9}>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <Text offWhite>{item} </Text>}
          keyExtractor={(item: any) => item}
          snapToAlignment="center"
          style={styles.propertyList}
        />
      </Container>
    );
  };

  render() {
    return (
      <Container color="accent" flex={0.9} style={styles.mainContainer} center>
        <Text h1 offWhite style={{ paddingTop: theme.sizes.padding }}>
          Add Property
        </Text>
        {this.renderImageSection()}

        <HeaderDivider title="Property Type" style={styles.divider} />
        {this.renderPropertyTypeSelection()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    height: "100%",
    right: 0,
    left: 0,
    bottom: 0,
    top: theme.sizes.padding * 2,
  },
  imageContainer: {
    backgroundColor: theme.colors.offWhite,
    borderRadius: 100,
    width: 90,
    height: 90,
  },
  cameraImage: {
    width: 61,
    height: 61,
  },
  divider: {
    top: 240,
  },
  propertyList: {
    
  }
});
