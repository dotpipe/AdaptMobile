import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button } from 'react-native-elements';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { StoreManagerDashboard } from '../services/store_manager_dashboard';
import { useStoreContext } from '../contexts/StoreContext';

const DashboardScreen = () => {
    const { storeId } = useStoreContext();
    const [dashboardData, setDashboardData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        const dashboard = new StoreManagerDashboard();
        const data = await dashboard.getDashboardData(storeId);
        setDashboardData(data);
    };

    useEffect(() => {
        fetchDashboardData();
    }, [storeId]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    if (!dashboardData) {
        return <Text>Loading dashboard data...</Text>;
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Card>
                <Card.Title>Today's Overview</Card.Title>
                <Text>Total Sales: ${dashboardData.todaySales}</Text>
                <Text>Customer Traffic: {dashboardData.todayTraffic}</Text>
                <Text>Avg. Transaction Value: ${dashboardData.avgTransactionValue}</Text>
            </Card>

            <Card>
                <Card.Title>Sales Trend (Last 7 Days)</Card.Title>
                <LineChart
                    data={dashboardData.salesTrend}
                    width={350}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    bezier
                />
            </Card>

            <Card>
                <Card.Title>Top Selling Products</Card.Title>
                <BarChart
                    data={dashboardData.topProducts}
                    width={350}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                />
            </Card>

            <Card>
                <Card.Title>Price Recommendations</Card.Title>
                {dashboardData.priceRecommendations.map((rec, index) => (
                    <Text key={index}>
                        {rec.productName}: ${rec.lowTraffic} - ${rec.highTraffic}
                    </Text>
                ))}
            </Card>

            <Card>
                <Card.Title>Quick Actions</Card.Title>
                <Button title="Update Inventory" onPress={() => {/* Handle inventory update */}} />
                <Button title="View Detailed Reports" onPress={() => {/* Navigate to reports */}} />
                <Button title="Manage Staff" onPress={() => {/* Navigate to staff management */}} />
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

export default DashboardScreen;