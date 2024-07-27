// In screens/StoreManagerDashboard.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useProductSettings } from '../hooks/useProductSettings';

const ProductSettingsItem = ({ product, onTogglePercentDisplay }) => {
    return (
        <View style={styles.productItem}>
            <Text>{product.name}</Text>
            <Switch
                value={product.show_percent_to_customers}
                onValueChange={() => onTogglePercentDisplay(product.id)}
            />
        </View>
    );
};

const StoreManagerDashboard = () => {
    const { products, togglePercentDisplay } = useProductSettings();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product Settings</Text>
            {products.map(product => (
                <ProductSettingsItem
                    key={product.id}
                    product={product}
                    onTogglePercentDisplay={togglePercentDisplay}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
});

export default StoreManagerDashboard;