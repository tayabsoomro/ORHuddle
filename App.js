import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 6.2.2
import { createBottomTabNavigator, createStackNavigator, TabBarBottom, createAppContainer } from 'react-navigation';
import { LinearGradient } from 'expo';
import { Divider } from 'react-native-elements'
import { ListItem } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native';




import ScheduleEntry from './assets/components/ScheduleEntry';
import ScheduleView from './assets/components/ScheduleView';

class ScheduleEntryScreen extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
              style={styles.linear_gradient}
            >
            <ScheduleEntry />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

//example for detail screen
class DetailView extends React.Component {

  constructor(props){
    super(props);
  }



  render(){
    const { navigation } = this.props;
    const currentItem = navigation.getParam("item", "NULL");
    return(
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.heading}>Information</Text>
            <View style={{ height: 20 }}></View>
            <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 1,
                paddingTop: 25, alignItems: 'center', paddingBottom: 5
              }}
            />
            <View style={{left: '5%',top: '5%'}}>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Name:</Text>
                <Text style={{fontSize: 20}}> { currentItem.name }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Surgeon:</Text>
                <Text style={{fontSize: 20}}> { currentItem.surgeon }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Type:</Text>
                <Text style={{fontSize: 20}}> { currentItem.type }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Start Time:</Text>
                <Text style={{fontSize: 20}}> { currentItem.start_time }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>End Time:</Text>
                <Text style={{fontSize: 20}}> { currentItem.end_time }</Text>
              </Text>
            </View>
            <View style={{ height: 20 }}></View>
            <View>
              <View style={{height: 10}}></View>
              <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              <View style={{height: 10}}></View>
              <Text style={styles.heading}>Notes</Text>
              <View style={{ borderBottomColor: "#CCCCCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              {
                currentItem.notes.map((l,i) => (
                  <ListItem
                    key={i}
                    title={l.message}
                    titleStyle={{paddingLeft: '5%', fontSize: 20, textAlign: 'left'}}
                    subtitleStyle={{ paddingLeft: '5%', textAlign: 'left'}}
                    subtitle={l.author}
                    leftIcon={{ name: l.priority, color: l.priority == "error" ? "red" : "orange" }}
                    titleNumberOfLines={100}
                    hideChevron={true}
                    pad={30}
                  />
                ))
              }
            </View>
            <View>
              <View style={{height: 10}}></View>
              <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              <View style={{height: 10}}></View>
              <Button
                title="Edit Surgery"
                type="outline"
                color="#FAAC58"
                fontWeight="bold"
                onPress={() => { alert("This feature is under development. Instead of waiting, why don't you try solving the following integral: ∫(𝑥^7−1)/(log𝑥)d𝑥")}}
                buttonStyle={{
                  backgroundColor: "#FFF",
                  borderWidth: 1,
                  borderColor: "#CCC"
                }}
              />
              <View style={{height: 10}}></View>
              <Button
                title="Delete Surgery"
                type="outline"
                onPress={() => { alert("This feature is under development. Instead of waiting, why don't you try solving the following integral: ∫(𝑥^7−1)/(log𝑥)d𝑥")}}
                buttonStyle={{
                  backgroundColor: "#FA5858"
                }}
              />
              <View style={{height: 10}}></View>
            </View>
          </View>
        </ScrollView>
    );
  }
}

const SlateAppNavigator = createStackNavigator({
  Slate: {screen: ScheduleView},
  Details: {screen: DetailView},
}, {
  initialRouteName: 'Slate',
  headerMode: 'screen',
  mode: 'card',

});

class ScheduleViewScreen extends React.Component {
  static router = SlateAppNavigator.router;
  constructor(props){
    super(props)
  }

  render() {
    return (
      <SlateAppNavigator navigation={this.props.navigation} />
    );
  }
}



export default createAppContainer(createBottomTabNavigator(
  {
    ScheduleEntry: { screen: ScheduleEntryScreen },
    ScheduleView: { screen: ScheduleViewScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'ScheduleEntry') {
          iconName = `ios-add-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'ScheduleView') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#FF8800',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: '#222',
        color: '#FFF'
      }
    },
    animationEnabled: true,
    swipeEnabled: false,
    mode: 'card',
  }
));

const styles = StyleSheet.create({
  linear_gradient: {
    left: '5%',
    aspectRatio: 1,
    flex: 1,
    right: 0,
    top: 0
  },
  heading: {
    fontSize: 25,
    left: '5%',
    top: '5%',
    fontWeight: "bold",
  }
});
