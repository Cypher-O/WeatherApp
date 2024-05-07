import {
    View,
    Text,
    React,
    Image,
  } from "../constants/imports/reactNativeImports";
import { theme } from '../constants/imports/constantsImports';
import {
    tw,
    style,
  } from "../constants/imports/pluginsImports";

const ForecastDayItem = ({ item, dayName, weatherImages }) => {
  return (
    <View
      style={[
        tw`flex justify-center items-center w-24 rounded-3xl py-3 gap-y-1 mr-4`,
        { backgroundColor: theme.bgWhite(0.15) },
      ]}
    >
      <Image
        source={weatherImages[item?.day?.condition?.text]}
        style={tw`h-11 w-11`}
      />
      <Text style={tw`text-white`}>{dayName}</Text>
      <Text style={tw`text-white text-xl font-semibold`}>
        {item?.day?.avgtemp_c}&#176;
      </Text>
    </View>
  );
};

export default ForecastDayItem;
