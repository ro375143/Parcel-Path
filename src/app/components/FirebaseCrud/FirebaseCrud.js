"use client"

import FirebaseConfig from "../FirebaseConfig/FirebaseConfig"
import { ref, set, get, update, remove, child, DataSnapshot } from "firebase/database"
import { useState } from "react"

const database = FirebaseConfig();

function FirebaseCrud() {
    let [shipperName, setShippereName] = useState('');
    let [packageWeight, setPackageWeight] = useState('');
    let [packageTrackingNumber, setPackageTrackingNumber] = useState('');
    let [packageAddress, setPackageAddress] = useState('');
    let [shipDate, setShipDate] = useState('');
    let [estimatedDelivery, setEstimatedDelivery] = useState('');

    let isNullOrWhiteSpace = value => {
        value = value.toString();
        return (value == null || value.replaceAll(' ', '').length < 1)
    }

    let InsertData = () => {
        if(isNullOrWhiteSpace(shipperName) 
            || isNullOrWhiteSpace(packageWeight) 
            || isNullOrWhiteSpace(packageTrackingNumber) 
            || isNullOrWhiteSpace(packageAddress) 
            || isNullOrWhiteSpace(shipDate) 
            || isNullOrWhiteSpace(estimatedDelivery)) {
                alert("Please fill all fields")
                return;
            }
            set(ref(database, 'PackageDetails/' + packageTrackingNumber), {
                shipperName: shipperName,
                packageWeight: packageWeight,
                packageAddress: packageAddress,
                shipDate: shipDate,
                estimatedDelivery: estimatedDelivery
            });
    }

    let SelectData = () => {
        const dbref = ref(database);
        get(child(dbref, 'PackageDetails/' + packageTrackingNumber)).then(snapshot => {
            if(snapshot.exists()){
                setShippereName(snapshot.val(shipperName));
                setPackageWeight(snapshot.val(packageWeight));
                setPackageAddress(snapshot.val(packageAddress));
                setShipDate(snapshot.val(shipDate));
                setEstimatedDelivery(snapshot.val(estimatedDelivery));
            }
            else {
                alert("no data available")
            }
        }).catch((error) => {
            console.log(error);
            alert("error. the data reteival was unsuccessful")
        })
    }
    return (
        <>
            <label>Shipper Name</label>
            <input type="text" value={shipperName} onChange={e => setShippereName(e.target.value)} />

            <label>Package Weight</label>
            <input type="text" value={packageWeight} onChange={e => setPackageWeight(e.target.value)} />

            <label>Package Tracking Number</label>
            <input type="text" value={packageTrackingNumber} onChange={e => setPackageTrackingNumber(e.target.value)} />

            <label>Package Address</label>
            <input type="text" value={packageAddress} onChange={e => setPackageAddress(e.target.value)} />

            <label>Ship Date</label>
            <input type="date" value={shipDate} onChange={e => setShipDate(e.target.value)} />

            <label>Estimated Delivery</label>
            <input type="date" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} />

            <button onClick={InsertData}>Insert Data</button>
            <button>Update Data</button>
            <button>Delete Data</button>
            <button onClick={SelectData}>Select Data</button>

        </>
    )
}

export default FirebaseCrud;
