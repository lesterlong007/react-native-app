/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { 
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme,
  View,Image,ImageBackground
} from 'react-native';/*  */
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LineGradient from 'react-native-linear-gradient';

interface MoodItem {
  id: string;
  moodCount: number;
  dayName: string;
}

const App = () => {
  const [moodList, setMoodList] = useState<MoodItem []>([]);
  const [height, setHeight] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const maxHeight: MutableRefObject<any> = useRef(0);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /**
   * 获取背景颜色
   * @param id 
   * @param moodCount 
   * @returns 
   */
  const getBgColors = (id: string, moodCount: number) => {
    switch (true) {
      case moodCount >= 90:
        return id === activeId ? ['#FFA14A', '#FFCC4A']: ['#FF823C', '#FF823C']
      case moodCount < 90 && moodCount >= 80:
        return id === activeId ? ['#42F373', '#A1FD44']: ['#52C873', '#52C873']
      default:
        return id === activeId ? ['#CFCFCF', '#CFCFCF']: ['#CFCFCF', '#CFCFCF']
    }
  }

  /**
   * 获取星期几名称样式
   * @param moodCount 
   * @returns 
   */
  const getActiveStyle = (moodCount: number) => {
    const activeStyle = {
      elevation: 4,
      backgroundColor: 'white',
      borderRadius: 7
    };
    switch (true) {
      case moodCount >= 90:
        return {
          ...activeStyle,
          color: '#F36A1B'
        }
      case moodCount < 90 && moodCount >= 80:
        return {
          ...activeStyle,
          color: '#52C873'
        }
      default:
        return {
          ...activeStyle,
          color: '#CFCFCF'
        }
    }
  }


   /**
   * 根据指数值获取表情图
   * @param moodCount 
   * @returns 
   */
  const getImgSrc = (moodCount: number) => {
    switch (true) {
      case moodCount >= 90:
        return require('@/images/orange.png');
      case moodCount < 90 && moodCount >= 80:
        return require('@/images/green.png');
      default:
        return require('@/images/grey.png');
    }
  }

  /**
   * 载入柱形图动画
   * @returns 
   */
  const getAnimateFn = () => {
    let animateId = 0;
    const step = 8;
    const runAnimation = () => {
      animateId = requestAnimationFrame(() => {
        
        maxHeight.current += step;
        const heightArr = [];
        for(let i = 0; i < 7; i++) {
          let hVal = maxHeight.current - 2 * i * step;
          if (hVal > 296) {
            hVal = 296
          } else if(hVal < 0) {
            hVal = 0;
          }
          heightArr.push(hVal)
        }
        setHeight(heightArr);
        if ((heightArr[6] || 0) > 296) {
          return cancelAnimationFrame(animateId)
        }
        runAnimation();
      })
    };
    return runAnimation;
  };

  useEffect(() => {
    setMoodList([{
      id: '1',
      moodCount: 86,
      dayName: '六'
    }, {
      id: '2',
      moodCount: 80,
      dayName: '日'
    }, {
      id: '3',
      moodCount: 0,
      dayName: '一'
    }, {
      id: '4',
      moodCount: 90,
      dayName: '二'
    }, {
      id: '5',
      moodCount: 92,
      dayName: '三'
    }, {
      id: '6',
      moodCount: 97,
      dayName: '四'
    }, {
      id: '7',
      moodCount: 81,
      dayName: '五'
    }]);
    getAnimateFn()();
  }, [])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'}/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollWrapper}
        >
          <View style={styles.headerWrapper}>
            <Image
              style={styles.arrowImg}
              source={require('@/images/arrow.png')}
            />
            <Text style={styles.titleText}>历史心情指数</Text>
          </View>
          <ImageBackground source={require('@/images/shadow.png')} style={styles.bgImg}>
            <View style={styles.infoWrapper}>
              <View style={styles.userInfo}>
                <Image
                  style={styles.userImg}
                  source={require('@/images/avatar.png')}
                />
                <Text style={styles.userName}>李强</Text>
              </View>
              <Text style={styles.averCount}>88</Text>
              <Text style={styles.aveDesc}>周平均心情指数</Text>
            </View>
          </ImageBackground>
          <View style={styles.chatWrapper}>
          <View style={styles.middleLine} />
            {
              moodList.map((item: MoodItem, index: number) => (
                <View key={item.id} style={[styles.chatItem]}>
                  <View style={[styles.itemContent, {
                      height: (item.moodCount > 44 ? item.moodCount : 45) * (height[index] || 0)  / 100,
                    }, activeId === item.id && styles.contentActived]}
                  >
                    <View 
                      style={[styles.barWrapper, activeId === item.id && styles.actived]}
                      onTouchStart={() => setActiveId(item.id)}
                      onTouchEnd={() => setActiveId('')}
                    >
                      <LineGradient colors={getBgColors(item.id, item.moodCount)} style={styles.lGWrapper}>
                        <Text style={styles.countText}>{item.moodCount > 0 ? item.moodCount : ''}</Text>
                        <Image style={styles.countImg} source={getImgSrc(item.moodCount)} />
                      </LineGradient>
                    </View>
                    <Text style={[
                      styles.dayText, 
                      index === moodList.length - 1 && styles.mainDay, 
                      activeId === item.id && getActiveStyle(item.moodCount)
                    ]}>{item.dayName}</Text>
                  </View>
                </View>
              ))
            }
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollWrapper:{ 
    backgroundColor: 'white', 
    minHeight: '100%' 
  },
  headerWrapper: {
    position: 'relative',
  },
  arrowImg: {
    position: 'absolute',
    left: 10,
    top: 18,
    width: 34
  },
  bgImg: {
    resizeMode: 'cover',
    transform: [{translateY:  -30}],
  },
  infoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userImg: {
    width: 33,
    height: 33
  },
  userName: {
    marginLeft: 11,
    color: '#2D2F33',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 25
  },
  averCount: {
    fontSize: 65,
    fontWeight: 'bold',
    lineHeight: 89,
    color: '#2D2F33',
  },
  aveDesc: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
    color: '#929292',
  },
  titleText: {
    paddingTop: 20,
    textAlign: 'center',
    color: '#2D2F33',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 25
  },
  chatWrapper: {
    position: 'relative',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    transform: [{translateY:  -28}],
  },
  middleLine: {
    position: 'absolute',
    width: '100%',
    left: 12,
    top: '40%',
    height: 1,
    backgroundColor: '#F2F2F2'
  },
  chatItem: {
    width: 40,
    height: 290,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  itemContent: {
    width: 40,
    height: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentActived: {
    overflow: 'visible'
  },
  barWrapper: {
    width: 40,
    flex: 1,
    overflow: 'hidden',
  },
  actived: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.05 }],
    elevation: 2,
    borderWidth: 0.1,
    borderColor: 'transparent',
    borderRadius: 28
  },
  lGWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 11,
    paddingBottom: 4,
    borderRadius: 28
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 23,
    color: 'white'
  },
  countImg: {
    width: 33,
    height: 33,
  },
  dayText: {
    marginTop: 11,
    width: 33,
    height: 33,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 33,
    color: '#2D2F33',
    textAlign: 'center'
  },
  mainDay: {
    backgroundColor: '#2D2F33',
    borderRadius: 7,
    color: 'white'
  },
});

export default App;
