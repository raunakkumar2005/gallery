// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = () => {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    let isMounted = true; // Variable to track component mount status

    const fetchRecentImages = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem('cachedImageData');

        if (cachedImageData) {
          const parsedImageData = JSON.parse(cachedImageData);
          if (isMounted) {
            setImageData(parsedImageData);
          }
        }

        const response = await axios.get(
          'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s'
        );

        const newImageData = response.data.photos.photo;

        if (isMounted && JSON.stringify(newImageData) !== JSON.stringify(imageData)) {
          setImageData(newImageData);
          await AsyncStorage.setItem('cachedImageData', JSON.stringify(newImageData));
        }
      } catch (error) {
        console.error('Error fetching recent images:', error);
      }
    };

    fetchRecentImages();

    // Cleanup function to handle component unmount
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run the effect only once on mount

  const renderItem = ({ item }) => (
    <Image source={{ uri: item.url_s }} style={{ width: '48%', aspectRatio: 1, borderRadius: 10, margin: '2%' }} />
  );

  return (
    <View className="p-4 bg-gray-100 flex-1">

      <FlatList
        data={imageData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

export default HomeScreen;
