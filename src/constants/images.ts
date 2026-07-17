import Feather from '@react-native-vector-icons/feather'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import Octicons from '@react-native-vector-icons/octicons'

export const IMAGES = {
  characters: {
    su: require('@/../assets/images/Su-.png'),
    moa: require('@/../assets/images/Moa.png'),
    momo: require('@/../assets/images/Momo.png'),
  },
  cover200: {
    babymetal: require('@/../assets/images/BM_Splatter_200.png'),
    metalForth: require('@/../assets/images/Forth_Splatter_200.png'),
    metalGalaxy: require('@/../assets/images/Galaxy_Splatter_200.png'),
    theOne: require('@/../assets/images/One_Splatter_200.png'),
    metalResistance: require('@/../assets/images/Resistance_Splatter_200.png'),
    single: require('@/../assets/images/Single_200.png'),
    notFound: require('@/../assets/images/unknown_track.png'),
  },
  // no need to cache as asset because it is not used in web
  cover600: {
    a_babymetal: require('../../assets/images/BM_Splatter_632.png'),
    e_metalForth: require('../../assets/images/Forth_Splatter_632.png'),
    c_metalGalaxy: require('../../assets/images/Galaxy_Splatter_632.png'),
    d_theOne: require('../../assets/images/One_Splatter_632.png'),
    b_metalResistance: require('../../assets/images/Resistance_Splatter_632.png'),
    f_single: require('../../assets/images/Single_632.png'),
  },
  icons: {
    main: require('@/../assets/tabicons/main.png'),
    mainGrey: require('@/../assets/tabicons/mainGrey.png'),
    concertYear: require('@/../assets/images/concert_box_year.png'),
    concertCountry: require('@/../assets/images/concert_box_country.png'),
    concertTour: require('@/../assets/images/concert_box_tour.png'),
    concertUpcoming: require('@/../assets/images/concert_box_upcoming.png'),
    playerLoad: require('@/../assets/images/player_box_load.png'),
    playerMeta: require('@/../assets/images/player_box_metadata.png'),
    playerList: require('@/../assets/images/player_box_playlist.png'),
    playerPlay: require('@/../assets/images/player_box_play.png'),
  },
  other: {
    map: require('@/../assets/images/sample_map.png'),
    background: require('@/../assets/images/icon_background_blur.png'),
  },
  vector: {
    Octicons,
    MaterialIcons,
    Feather,
  },
  fonts: {
    octicons: require('@react-native-vector-icons/octicons/fonts/Octicons.ttf'),
    material: require('@react-native-vector-icons/material-icons/fonts/MaterialIcons.ttf'),
    feather: require('@react-native-vector-icons/feather/fonts/Feather.ttf'),
  },
}
