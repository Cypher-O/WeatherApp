import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  React,
  useCallback,
  useState,
  useEffect,
  StatusBar,
  Image,
  Progress,
} from "../constants/imports/reactNativeImports";

import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  debounce,
  tw,
  style,
} from "../constants/imports/pluginsImports";

import {
  fetchLocations,
  fetchWeatherForeCast,
  weatherImages,
} from "../constants/imports/apiImports";

import { theme } from "../constants/imports/constantsImports";
import { getData, storeData } from "../constants/imports/utilitiesImports";
import {ForecastDayItem, WeatherStats} from '../constants/imports/componentsImports';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForeCast({
      cityName: loc.name,
      days: "7",
    })
      .then((data) => {
        setWeather(data);
        setLoading(false);
        storeData('city', loc.name);
        console.log("forecast secured: ", data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
    console.log("location: ", loc);
  };
  const handleSearch = (value) => {
    // fetch locations
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
        console.log("location secured: ", data);
      });
    }
    console.log("value: ", value);
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  useEffect(()=> {
    fetchWeatherData();
  },[]);

  const fetchWeatherData = async ()=>{
    let myCity = await getData('city');
    let cityName = 'Ikeja';
    if(myCity) cityName = myCity;
    fetchWeatherForeCast({
        cityName,
        days: "7",
    }).then(data => {
        setWeather(data);
        setLoading(false);
    })
  }

  return (
    <View style={tw`flex-1 relative`}>
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require("../../assets/images/bg.png")}
        style={tw`absolute h-full w-full`}
      />
      {
        loading? (
            <View style={tw`flex-1 flex-row justify-center items-center`}>
                <Progress.CircleSnail thickness={10} size={70} color={'#0bb3b2'} />
                {/* <Text style={tw`text-white text-4xl`}>Loading.....
                </Text> */}
            </View>
        ) : (
            <SafeAreaView style={tw`flex flex-1`}>
        {/* search section */}
        <View style={tw`mx-4 relative z-50 h-7`}>
          <View
            style={[
              tw`flex-row justify-end items-center rounded-full`,
              {
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              },
            ]}
          >
            {showSearch ? (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search City"
                placeholderTextColor={"lightgray"}
                style={tw`pl-6 h-10 pb-1 flex-1 text-base text-white`}
              />
            ) : null}

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={[
                tw`rounded-full p-3 m-1`,
                { backgroundColor: theme.bgWhite(0.3) },
              ]}
            >
              <MagnifyingGlassIcon size={25} color="white" />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch ? (
            <View style={tw`absolute w-full bg-gray-300 top-16 rounded-3xl`}>
              {locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? " border-b-2 border-b-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleLocation(loc)}
                    style={[
                      tw`flex-row items-center border-0 p-3 px-4 mb-1`,
                      { borderClass },
                    ]}
                  >
                    <MapPinIcon size={20} color={"gray"} />
                    <Text style={tw`text-black text-lg ml-2`}>
                      {loc?.name}, {loc?.region+ " "}{loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        <View style={tw`mx-4 flex justify-around flex-1 mb-2`}>
          {/* location */}
          <Text style={tw`text-white text-center text-2xl font-bold`}>
            {location?.name},
            <Text style={tw`text-lg font-semibold text-gray-300`}>
              {" " + location?.region + " "}{location?.country}
            </Text>
          </Text>
          {/* weather image */}
          <View style={tw`flex-row justify-center`}>
            <Image
            //    source={{uri: 'https:'+current?.condition?.icon}}
              source={weatherImages[current?.condition?.text]}
              style={tw`w-52 h-52`}
            />
          </View>
          {/* degree celsius */}
          <View style={tw`gap-x-2`}>
            <Text style={tw`text-center font-bold text-white text-6xl ml-5`}>
              {current?.temp_c}&#176;
            </Text>
            <Text style={tw`text-center text-white text-xl tracking-widest`}>
              {current?.condition?.text}
            </Text>
          </View>
          {/* other stats */}
          <View style={tw`flex-row justify-between mx-4`}>
            <WeatherStats iconName={require("../../assets/icons/wind.png")} value={`${current?.wind_kph}km`} />
            <WeatherStats iconName={require("../../assets/icons/drop.png")} value={`${current?.humidity}%`} />
            <WeatherStats iconName={require("../../assets/icons/sun.png")} value={weather?.forecast?.forecastday[0]?.astro?.sunrise} />
          </View>
        </View>
        {/* forecast for next days */}
        <View style={tw`mb-2 gap-y-3`}>
          <View style={tw`flex-row items-center mx-5 gap-x-2`}>
            <CalendarDaysIcon size={22} color={"white"} />
            <Text style={tw`text-white text-base`}>Daily Forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            {weather?.forecast?.forecastday?.slice(1)?.map((item, index) => {
                let date = new Date(item.date);
                let options = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];

              console.log("Day " + index + ": ", item.date);
              console.log("Temperature " + index + ": ", item?.day?.avgtemp_c);
              return (
                <ForecastDayItem
                    key={index}
                    item={item}
                    dayName={dayName}
                    weatherImages={weatherImages}/>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
        )
      }
      
    </View>
  );
}
