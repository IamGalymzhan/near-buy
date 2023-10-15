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

const DATA = [
    {
        barcode: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        name: 'Хлеб',
        amount: 1.0,
        unit: 'шт',
    },
    {
        barcode: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        name: 'Морковь',
        amount: 1.0,
        unit: 'кг',
    },
    {
        barcode: '58694a0f-3da1-471f-bd96-145571e29d72',
        name: 'Бананы Уругвай зеленые красивые',
        amount: 1.0,
        unit: 'кг',
    },
];

const products = [
    {
        key: 123456789123,
        value: "Банан",
    },
    {
        key: 987654321987,
        value: "Хлеб",
    },
    {
        key: 147258369147,
        value: "Морковь",
    },

]

const saveShoppingList = async (data) => {
    try {
        const jsonValue = JSON.stringify(data);
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

const Item = ({ name, amount, unit }) => (
    <View style={styles.item}>
        <View flex={1}>
            <Text style={styles.name} adjustsFontSizeToFit numberOfLines={2}>{name}</Text>
        </View>
        <View>
            <TouchableOpacity
                onPress={() => { }}
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
                onChange={() => { }}
                style={styles.spinner}
            >
                <Text>{unit} </Text>
            </InputSpinner>
        </View>
    </View>
);

const ListScreen = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const PopUp = () => {
        const [selectedId, setSelectedId] = useState(0);
        const [currentAmount, setCurrentAmount] = useState(1);
        const [currentQuantity, setCurrentQuantity] = useState('');

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
                            data={products}
                            save='key'
                            setSelected={(val) => { setSelectedId(val) }}
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

    const [shoppingList, setShoppingList] = useState([]);
    const [productList, setProductList] = useState([]);

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
                data={DATA}
                renderItem={({ item }) => <Item name={item.name} amount={item.amount} unit={item.unit} />}
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