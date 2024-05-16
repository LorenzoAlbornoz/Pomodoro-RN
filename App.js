import {
  StyleSheet,
  Platform,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Timer from "./components/Timer";
import { Audio } from "expo-av";

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"];

export default function Page() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if(isActive){
      // run timer
      interval = setInterval(() => {
       setTime(time - 1)
      }, 1000)
    } else{
      // clear interval
      clearInterval(interval);
    }

    if(time === 0){
      setIsActive(false)
      setIsWorking((prev) => !prev)
      setTime(isWorking ? 300 : 1500);
    }
    return () => clearInterval(interval)
  }, [isActive, time])

  function handleStartStop(){
    playSound();
    setIsActive(!isActive);
  }

  async function playSound(){
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/mouse-click-117076.mp3")
    )
    await sound.playAsync();
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[currentTime] }]}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: Platform.OS === "android" && 30,
          borderWidth: 3,
        }}
      >
        <Text style={styles.title}>Pomodoro</Text>
        <Header
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setTime={setTime}
        />
        <Timer time={time} />
        <TouchableOpacity onPress={handleStartStop} style={styles.button}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {isActive ? "STOP" : "START"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  },
});
