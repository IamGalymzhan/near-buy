import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
    Modal,
} from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import { SelectList } from 'react-native-dropdown-select-list';
import { Trash2, Plus, Minus, X } from 'react-native-feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productList } from '../data/productList';

const saveShoppingList = async (shoppingList) => {
    try {
        const jsonValue = JSON.stringify(shoppingList);
        await AsyncStorage.setItem('shoppingListData', jsonValue);
    } catch (error) {
        console.error('Error saving shopping list:', error);
    }
};

const getShoppingList = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('shoppingListData');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error loading shopping list:', error);
    }
};


const ListScreen = ({ navigation }, props) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const [shoppingList, setShoppingList] = useState([]);

    const selectListData = productList.map((item) => ({
        key: item.barcode,
        value: item.name,
    }));

    const PopUp = () => {
        const [selectedId, setSelectedId] = useState(0);
        const [currentName, setCurrentName] = useState('');
        const [currentAmount, setCurrentAmount] = useState(1);
        const [currentUnit, setCurrentUnit] = useState('');


        const handleSave = () => {
            setModalVisible(false);
            for (let i = 0; i < shoppingList.length; i++) {
                if (shoppingList[i].barcode == selectedId) {
                    return;
                }
            }
            setShoppingList([...shoppingList,
            { barcode: selectedId, name: currentName, amount: currentAmount, unit: currentUnit }]
            )
            saveShoppingList(shoppingList);
        }

        return (
            <Modal
                visible={isModalVisible}
                animationType='fade'
                transparent={true}
                onRequestClose={() => { setModalVisible(false); }}
            >
                <View style={styles.modalWindow}>
                    <View style={styles.selectListContainer}>
                        <SelectList
                            data={selectListData}
                            save='key'
                            setSelected={(val) => {
                                setSelectedId(val);
                                for (let i = 0; i < productList.length; i++) {
                                    if (productList[i].barcode == val) {
                                        setCurrentName(productList[i].name);
                                        setCurrentUnit(productList[i].unit);
                                    }
                                }
                            }}
                        />
                    </View>
                    <View flexDirection='row'>
                        <InputSpinner
                            min={1} max={30}
                            value={currentAmount} rounded={false}
                            buttonStyle={styles.spinnerButton} inputStyle={styles.spinnerInput}
                            buttonLeftImage={<Minus color={plusMinusColor} />}
                            buttonRightImage={<Plus color={plusMinusColor} />}
                            onChange={(val) => { setCurrentAmount(val) }}
                            style={styles.spinner}
                        >
                            <Text></Text>
                        </InputSpinner>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleSave}
                        >
                            <Text>Добавить</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.roundCloseButton}
                        onPress={() => { setModalVisible(false) }}
                    >
                        <X />
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }


    const Item = ({ barcode, name, amount, unit }) => (
        <View style={styles.item}>
            <View flex={1}>
                <Text style={styles.name} adjustsFontSizeToFit numberOfLines={2}>{name}</Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => {deleteFromShoppingList(barcode)}}
                    style={styles.button}
                >
                    <Trash2 color='red' />
                </TouchableOpacity>
                <InputSpinner
                    min={1} max={30} value={amount} rounded={false}
                    buttonStyle={styles.spinnerButton} inputStyle={styles.spinnerInput}
                    buttonFontSize={10}
                    buttonLeftImage={<Minus color={plusMinusColor} />}
                    buttonRightImage={<Plus color={plusMinusColor} />}
                    onChange={(val) => {updateFromShoppingList(barcode, val)}}
                    style={styles.spinner}
                >
                    <Text>{unit} </Text>
                </InputSpinner>
            </View>
        </View>
    );

    const updateFromShoppingList = (barcode, amount) => {
        const tempList = [...shoppingList];
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].barcode == barcode) {
                const item = {barcode: barcode, amount: amount, unit: tempList[i].unit, name:tempList[i].name}
                tempList[i] = item;
                break;
            }
        }
        setShoppingList(tempList);
    }

    const deleteFromShoppingList = (barcode) => {
        setShoppingList(shoppingList.filter(item => {
            if (item.barcode != barcode) return true;
        }))
    }


    useEffect(() => {
        // Load shopping list data from AsyncStorage
        getShoppingList()
            .then((data) => setShoppingList(data))
            .catch((error) => console.error('Error loading shopping list:', error));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.head}>Список покупок</Text>
            <FlatList
                data={shoppingList}
                renderItem={({ item }) => <Item barcode={item.barcode} name={item.name} amount={item.amount} unit={item.unit} />}
                keyExtractor={item => item.barcode}
            />
            <TouchableOpacity style={styles.roundAddButton} onPress={() => setModalVisible(true)}>
                <Plus />
            </TouchableOpacity>
            <PopUp />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    head: {
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: 30,
    },
    item: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        backgroundColor: 'aliceblue',
        width: 'auto',
        flex: 1,
        borderRadius: 20,
    },
    name: {
        fontSize: 30,
        flex: 1,
        alignSelf: 'flex-start',
        paddingRight: 20,
        padding: 10,
    },
    button: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    spinner: {
        width: 80,
        height: 40,
        alignSelf: 'flex-end',
        marginRight: 10
    },
    spinnerButton: {
        height: 30,
        width: 30,
        backgroundColor: '#fff'
    },
    spinnerInput: {
        width: 20,
    },
    roundAddButton: {
        position: 'absolute',
        bottom: 36,
        right: 16,
        backgroundColor: 'blue',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roundCloseButton: {
        position: 'absolute',
        bottom: 36,
        right: 16,
        backgroundColor: 'red',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalWindow: {
        flex: 1,
        width: '100%',
        height: '70%',
        alignSelf: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    selectListContainer: {
        //marginHorizontal: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    addButton: {
        width: 200,
        backgroundColor: 'red',
        alignContent: 'center',
        justifyContent: 'center',
    }
});

const plusMinusColor = '#024a0b'

export default ListScreen;