import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import * as Location from "expo-location";

const WEATHER_FUNCTION_URL =
  "http://192.168.0.16:5001/minimal-weather-app-a7e9e/us-central1/getWeather";

export default function App() {
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [highTemperature, setHighTemperature] = useState(null);
  const [lowTemperature, setLowTemperature] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({latitude: null, longitude: null});

  const getWeatherIcon = (weathercode) => {
    switch (weathercode) {
      case 0:
        return "🌞";
      case 1:
        return "🌤";
      case 2:
        return "🌥";
      case 3:
        return "☁️";
      case 45:
        return "🌫️";
      case 48:
        return "❄️";
      case 51:
        return "🌧️";
      case 53:
        return "🌧️";
      case 61:
        return "🌦️";
      case 71:
        return "❄️";
      case 73:
        return "🌨️";
      case 80:
        return "⛈️";
      default:
        return "🌥";
    }
  };

  const handleGetWeather = async () => {
    setIsLoading(true);
    const latitude = location.latitude || 51.51;
    const longitude = location.longitude || -0.13;

    const urlWithParams = `${WEATHER_FUNCTION_URL}?latitude=${latitude}&longitude=${longitude}`;
    try {
      console.log(
        `Fetching weather data for location: ${latitude} lat, ${longitude} long.`
      );
      const response = await fetch(urlWithParams);

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.status);
      }

      const weatherData = await response.json();
      console.log("Weather Data:", weatherData);

      const currentTemp = weatherData.current_weather.temperature;
      const currentWeatherCode = weatherData.current_weather.weathercode;

      const hourlyTemperatures = weatherData.hourly.temperature_2m;
      const todayTemperatures = hourlyTemperatures.slice(0, 24);
      const highTemp = Math.max(...todayTemperatures);
      const lowTemp = Math.min(...todayTemperatures);

      setCurrentTemperature(currentTemp);
      setWeatherIcon(getWeatherIcon(currentWeatherCode));
      setHighTemperature(highTemp);
      setLowTemperature(lowTemp);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      handleGetWeather();
    };

    getLocation();
  }, []);

  return (
    <LinearGradient colors={["#FFFFFF", "#8E9BFF"]} style={styles.container}>
      <View style={styles.content}>
        {currentTemperature === null && (
          <TouchableOpacity style={styles.button} onPress={handleGetWeather}>
            <Text style={styles.buttonText}>Get Weather</Text>
          </TouchableOpacity>
        )}

        {currentTemperature !== null && (
          <View style={styles.weatherInfo}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <Text style={styles.temperatureText}>
                  {currentTemperature.toFixed(1)} °C
                </Text>
                <Text style={styles.iconText}>{weatherIcon}</Text>
                <Text style={styles.highLowText}>
                  Today's High:{" "}
                  {highTemperature !== null ? highTemperature.toFixed(1) : "--"}{" "}
                  °C | Today's Low:{" "}
                  {lowTemperature !== null ? lowTemperature.toFixed(1) : "--"}{" "}
                  °C
                </Text>
              </>
            )}
          </View>
        )}

        {currentTemperature !== null && (
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={handleGetWeather}
          >
            <Text style={styles.reloadText}>🔄</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    alignItems: "center"
  },
  button: {
    backgroundColor: "#4A49FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold"
  },
  weatherInfo: {
    alignItems: "center",
    marginTop: 20
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: "bold"
  },
  iconText: {
    fontSize: 64,
    marginTop: 10
  },
  highLowText: {
    fontSize: 16,
    marginTop: 10
  },
  reloadButton: {
    borderRadius: 50,
    padding: 10
  },
  reloadText: {
    fontSize: 24
  }
});
