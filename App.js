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


// const makeSqliteDirAsync = async () => {
//   const db = SQLite.openDatabase('dummy.db');
//   try {
//     await db.transaction(tx => tx.executeSql(''));
//   } catch(e){
//     console.log('error while executing SQL in dummy DB');
//   }
// }

const db = SQLite.openDatabase('ourhuddle.db');

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      db: null
    };
  }

  // componentDidMount(){
  //   makeSqliteDirAsync();
  //
  //   Expo.FileSystem.downloadAsync(
  //    	Expo.Asset.fromModule(require('./assets/components/tayab.db')).uri,
  //    	`${Expo.FileSystem.documentDirectory}SQLite/tayab.db`
  //    )
  //    .then(function(){
  //
  //    	let _db = SQLite.openDatabase('ourhuddle.db');
  //
  //
  //   });
  //
  // }

  componentDidMount(){
    console.log("APPJS-COMPONENT_MOUNT")
    db.transaction(tx => {

      tx.executeSql(`DROP TABLE IF EXISTS Draping;`);
      tx.executeSql(`DROP TABLE IF EXISTS Equipment`);
      tx.executeSql(`DROP TABLE IF EXISTS Hints`);
      tx.executeSql(`DROP TABLE IF EXISTS Notes`);
      tx.executeSql(`DROP TABLE IF EXISTS Positioning`);
      tx.executeSql(`DROP TABLE IF EXISTS ProcedureTypes`);
      tx.executeSql(`DROP TABLE IF EXISTS Procedures`);
      tx.executeSql(`DROP TABLE IF EXISTS SkinPrep`);
      tx.executeSql(`DROP TABLE IF EXISTS Surgeons`);
      tx.executeSql(`DROP TABLE IF EXISTS ProtectiveEquipment`);

      tx.executeSql(`CREATE TABLE IF NOT EXISTS  Draping (id INTEGER PRIMARY KEY, procedure_type_id INTEGER NULL, description TEXT NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  Equipment (id INTEGER PRIMARY KEY, procedure_type_id INTEGER NULL, description TEXT NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  Hints (id INTEGER PRIMARY KEY, procedure_id INTEGER NULL, surgeon_id INTEGER NULL, hint_message TEXT NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  Notes (id INTEGER PRIMARY KEY, surgeon_id INTEGER NULL, procedure_id INTEGER NULL, note_message TEXT NULL, priority TEXT NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  Positioning (id INTEGER PRIMARY KEY, procedure_type_id INTEGER NULL, description TEXT NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  ProcedureTypes (id INTEGER PRIMARY KEY, name TEXT NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  Procedures (id INTEGER PRIMARY KEY, procedure_type_id INTEGER NULL, surgeon_id INTEGER NULL, start_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, end_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  ProtectiveEquipment (id INTEGER, procedure_type_id INTEGER NULL, stock_number TEXT NULL, description TEXT NULL, quantity INTEGER NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  SkinPrep (id INTEGER PRIMARY KEY, procedure_type_id INTEGER NULL, description TEXT NULL)`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS  Surgeons (id INTEGER PRIMARY KEY, name TEXT NULL)`);

      tx.executeSql(`INSERT INTO Surgeons (id,name) VALUES (1,'Dr.Kishore Visvanathan')`);
      tx.executeSql(`INSERT INTO SkinPrep
        (id,procedure_type_id,description) VALUES
        (1,1,'CHLORHEXIDINE 2% ALCOHOL FREE'),
        (2,2,'DEXIDIN - SHAVE'),
        (3,3,'- SOLUPREP'),
        (4,4,'- SOLUPREP AQ SPONGES 2%CHG ALCOHOL FREE'),
        (5,5,'- SOLUPREP AQ SPONGES 2%CHG ALCOHOL FREE'),
        (6,6,'- SOLUPREP AQ SPONGES 2%CHG ALCOHOL FREE')`);
      tx.executeSql(`INSERT INTO ProtectiveEquipment
        (id,procedure_type_id,stock_number,description,quantity) VALUES
        (1,1,'4/79003','GLOVE SURGEON POLYISOPRENE SIZE 7.5',2),
        (2,2,'4/79003','GLOVE SURGEON POLYISOPRENE SIZE 7.5',2),
        (3,3,'4/79003','GLOVE SURGEON POLYISOPRENE SIZE 7.5',2),
        (4,3,'4/49351','GOWN SURGICAL CONVERTORS SMARTGOWN XL XL',1),
        (5,4,'4/79003','GLOVE SURGEON POLYISOPRENE SIZE 7.5',2),
        (6,5,'4/79003','GLOVE SURGEON POLYISOPRENE SIZE 7.5',2),
        (7,6,'4/79003','GLOVE SURGEON POLYISOPRENE SIZE 7.5',2)`);
      tx.executeSql(`INSERT INTO Procedures
        (id,procedure_type_id,surgeon_id) VALUES
        (1,1,1),
        (2,2,1),
        (3,3,1),
        (4,4,1),
        (5,5,1),
        (6,6,1)`);
      tx.executeSql(`INSERT INTO ProcedureTypes
        (id,name) VALUES
        (1,'Green light laser prostatectomy (VISTURPLZ)'),
        (2,'Hydrocoelectomy/Spermatocoelectomy (VISHYDCOL)'),
        (3,'Laparoscopic Nephrectomy (VISLAPNEPH)'),
        (4,'TURBT (VISTUBLDTM)'),
        (5,'TURP (VISTURP)'),
        (6,'Ureteroscopy with laser lithotripsy (VISHOLZURE)')`,[],(tx,res)=>{console.log("SUCCESSHINTS");},(tx,err)=>{console.log("ERRORHINT");console.log(err);});
      tx.executeSql(`INSERT INTO Positioning
        (id,procedure_type_id,description) VALUES
        (1,1,'LITHOTOMY'),
        (2,2,'SUPINE'),
        (3,3,'- LATERAL - BEANBAG, 3 - PILLOWS, AXILLA ROLL'),
        (4,4,'LITHOTOMY '),
        (5,5,'LITHOTOMY'),
        (6,6,'CYSTO TABLE/STIRRUPS')`,[],(tx,res)=>{console.log("SUCCESSHINTS1");},(tx,err)=>{console.log("ERRORHINT1");console.log(err);});
      tx.executeSql(`INSERT INTO Hints
        (id,procedure_id,surgeon_id,hint_message) VALUES
        (1,1,1,'- **ABSOLUTELY NO ENTRACE/EXIT THROUGH FRONT DOOR**'),
        (2,1,1,'- VIDEO CAMERA FILTER INSERT:  FITS IN CAMERA - FLAT PART DOWN - RAISED PART TOWARDS SCOPE ***DONT LOSE IT*** (OR THROW IT OUT)'),
        (3,1,1,'- GREENLIGHT XPS FIBER CARD (SUPPLIED IN FIBER PACKAGE). XPS GL FIBER.'),
        (4,2,1,'- CAUTERY 40 / 40'),
        (5,2,1,'- 20ML SYRINGE & 27G INJECTION'),
        (6,2,1,'DRESSING: FLUFF GAUZE & SPRAY'),
        (7,3,1,'- CYSTO IRRIGATION TUBING & SUCTION TUBING FOR USE WITH LAPAROSCOPIC PISTOL HANDLE (PROBE PLUS) \#204551 & LAPAROSCOPIC RIGHT ANGLE SHAFT \#204552 - USE STERISTRIPS TO WRAP AROUND ALL 3 CORDS/TUBES *'),
        (8,3,1,'- DOES NOT LIKE THE 5.5MM 45 DEG SCOPE'),
        (9,3,1,'- VIDEO STACK ON'),
        (10,4,1,'- USE WATER FOR IRRIGATION'),
        (11,4,1,'- CAUTERY SETTING 120 PURE 30 FULGURATE'),
        (12,4,1,'- ASK RE: FOLEY'),
        (13,4,1,'- SINGLE GLOVES FOR CYSTO ROOM PROCEDURES '),
        (14,4,1,'- IF BOOKED WITH CYSTOLITHOTRIPSY FOR BLADDER STONES, ADD:EDNA TOWEL CLIPS (6152)SURGICAL TOWEL (536035) SINGLE BASIN (53609'),
        (15,5,1,'- CAUTERY SETTING 200/80'),
        (16,5,1,'- GLYCINE FOR IRRIGATION'),
        (17,5,1,'- SEND A DOUBLE SET OF GLYCINE WITH PATIENT TO PACU'),
        (18,5,1,'- SINGLE GLOVES FOR CYSTO ROOM PROCEDURES'),
        (19,5,1,'- 3 WAY FOLEY (ASK RE: SIZE) - 22FR - 3 WAY ON CASE CART (ASK)'),
        (20,5,1,'- USES BLADE AT END OF CASE WITH CYSTO TUBING'),
        (21,6,1,'- DR. VISVANATHAN SINGLE GLOVES FOR CYSTO ROOM PROCEDURES'),
        (22,6,1,'- USES SALINE FOR IRRIGATION'),
        (23,6,1,'- 3000ML INFUSOR CUFF X 2'),
        (24,6,1,'- LASER ACCESSORY BUCKET (YELLOW) - BACK OF CYSTO ROOM'),
        (25,6,1,'- EDNA TOWEL CLIP TO SECURE DRAPES'),
        (26,6,1,'- OPAQUE WINDOW COVERING FOR LASER SAFETY REQUIRED F')`,[],(tx,res)=>{console.log("SUCCESSHINTS2");},(tx,err)=>{console.log("ERRORHINT2");console.log(err);});
      tx.executeSql(`INSERT INTO Equipment
        (id,procedure_type_id,description) VALUES
        (1,3,'- LAPAROSCOPIC VIDEO TOWER'),
        (2,3,'- UPPER BODY BAIR HUGGER'),
        (3,3,'- SEQUENTIAL COMPRESSION STOCKINGS'),
        (4,6,'HOLMIUM LASER')`);
      tx.executeSql(`INSERT INTO Draping
        (id,procedure_type_id,description) VALUES
        (1,1,'CUSTOM TUR CYSTO PACK'),
        (2,2,'MINOR LAPAROTOMY PACK'),
        (3,3,'- CUSTOM UNIVERSAL PACK'),
        (4,3,'- 2 SURG TOWELS'),
        (5,4,'CYSTO TUR PACK'),
        (6,5,'CYSTO TUR PACK'),
        (7,6,'CYSTO TUR PACK'),
        (8,6,'SURG. TOWELS')`);
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
    top: 0,
    backgroundColor: "#BDCDDB"
  }
});
