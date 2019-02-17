import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 6.2.2
import { createBottomTabNavigator, createStackNavigator, TabBarBottom, createAppContainer } from 'react-navigation';



import ScheduleEntry from './assets/components/ScheduleEntry';
import ScheduleView from './assets/components/ScheduleView';
import DetailView from './assets/components/DetailView';
import EditSurgeryView from './assets/components/EditSurgeryView';
import { SQLite } from 'expo';


const db = SQLite.openDatabase('test.db');


export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      text: null
    };
  }

  componentDidMount(){
    console.log("WORKS!");

    db.transaction(tx => {
      tx.executeSql(`DROP TABLE IF EXISTS surgery_types`);
      // tx.executeSql(`DROP TABLE IF EXISTS surgeries`);

      tx.executeSql(`CREATE TABLE IF NOT EXISTS surgery_types (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255),
                equipment_image VARCHAR(255),
                helpful_hints TEXT)`,[],
                function(tx,res){console.log("[TABLE_CREATED] surgery_types");},
                function(tx,err){console.log("DBERROR: 01");}
      );

      tx.executeSql(`CREATE TABLE IF NOT EXISTS surgeries (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255),
                surgeon_name VARCHAR(255),
                start_time VARCHAR(255),
                end_time VARCHAR(255),
                surgery_type_id INT NOT NULL REFERENCES surgery_types(id))`,[],
                function(tx,res){console.log("[TABLE_CREATED] surgeries");},
                function(tx,err){console.log("DBERROR: 02");console.log(err);}
      );

      tx.executeSql(`CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY,
                message TEXT,
                surgery_id INT NOT NULL REFERENCES surgeries(id),
                priority VARCHAR(10),
                author VARCHAR(255))`,[],
                function(tx,res){console.log("[TABLE_CREATED] notes");},
                function(tx,err){console.log("DBERROR: 06");console.log(err);}
      );

      tx.executeSql(`INSERT INTO surgery_types
                (name,equipment_image,helpful_hints) VALUES
                ("Surgery Type 1", "Hint1;Hint2;Hint3","N/a"),
                ("Surgery Type 2", "N/a","N/a"),
                ("Surgery Type 3", "N/a","Hint1;Hint2;Hint3");`,[],
                function(tx,res){console.log("[DB_INITIALIZED] surgery_types");},
                function(tx,err){console.log("DBERROR: 03");}

      );

    });
  }

  render(){
    return(
      <AppContainer />
    );
  }
}

class ScheduleEntryScreen extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
              style={styles.linear_gradient}
            >
            <ScheduleEntry/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const SlateAppNavigator = createStackNavigator({
  Slate: {screen: ScheduleView},
  Details: {screen: DetailView},
  EditSurgery: {screen: EditSurgeryView},

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


const AppContainer = createAppContainer(createBottomTabNavigator(
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
  }
});
