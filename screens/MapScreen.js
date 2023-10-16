import React, {useState} from "react";
import {View} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { initializeApp } from "firebase/app";
import * as Location from "expo-location";
import {getFirestore, setDoc, doc, deleteAllPersistentCacheIndexes} from "firebase/firestore";
const MapScreen = ({ navitagion }) => {
    const apiKey = "AIzaSyAuiyPSzZtk6UcVC71pcR-t7e-uW113VF4";
    
    return (
        <View>


        </View>
    )
}

export default MapScreen;
