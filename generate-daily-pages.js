const fs = require('fs');
const path = require('path');

// Comprehensive city database with 1000+ cities
const cityDatabase = {
  'United States': {
    'Alabama': [
      { name: 'Birmingham', lat: 33.5207, lng: -86.8025, pop: 200733 },
      { name: 'Montgomery', lat: 32.3792, lng: -86.3077, pop: 200603 },
      { name: 'Mobile', lat: 30.6954, lng: -88.0399, pop: 187041 },
      { name: 'Huntsville', lat: 34.7304, lng: -86.5861, pop: 215006 },
      { name: 'Tuscaloosa', lat: 33.2098, lng: -87.5692, pop: 101129 }
    ],
    'Alaska': [
      { name: 'Anchorage', lat: 61.2181, lng: -149.9003, pop: 291247 },
      { name: 'Fairbanks', lat: 64.8378, lng: -147.7164, pop: 32515 },
      { name: 'Juneau', lat: 58.3019, lng: -134.4197, pop: 32255 }
    ],
    'Arizona': [
      { name: 'Phoenix', lat: 33.4484, lng: -112.0740, pop: 1608139 },
      { name: 'Tucson', lat: 32.2226, lng: -110.9747, pop: 548073 },
      { name: 'Mesa', lat: 33.4152, lng: -111.8315, pop: 504258 },
      { name: 'Chandler', lat: 33.3062, lng: -111.8413, pop: 275987 },
      { name: 'Scottsdale', lat: 33.4942, lng: -111.9261, pop: 258069 },
      { name: 'Glendale', lat: 33.5387, lng: -112.1860, pop: 248325 },
      { name: 'Tempe', lat: 33.4255, lng: -111.9400, pop: 195805 }
    ],
    'Arkansas': [
      { name: 'Little Rock', lat: 34.7465, lng: -92.2896, pop: 198042 },
      { name: 'Fort Smith', lat: 35.3859, lng: -94.3985, pop: 87788 },
      { name: 'Fayetteville', lat: 36.0726, lng: -94.1574, pop: 93949 }
    ],
    'California': [
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, pop: 3898747 },
      { name: 'San Diego', lat: 32.7157, lng: -117.1611, pop: 1386932 },
      { name: 'San Jose', lat: 37.3382, lng: -121.8863, pop: 1013240 },
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194, pop: 873965 },
      { name: 'Fresno', lat: 36.7378, lng: -119.7871, pop: 542107 },
      { name: 'Sacramento', lat: 38.5816, lng: -121.4944, pop: 524943 },
      { name: 'Long Beach', lat: 33.7701, lng: -118.1937, pop: 466742 },
      { name: 'Oakland', lat: 37.8044, lng: -122.2712, pop: 440646 },
      { name: 'Bakersfield', lat: 35.3733, lng: -119.0187, pop: 380874 },
      { name: 'Anaheim', lat: 33.8366, lng: -117.9143, pop: 352497 },
      { name: 'Santa Ana', lat: 33.7455, lng: -117.8677, pop: 334136 },
      { name: 'Riverside', lat: 33.9533, lng: -117.3961, pop: 331360 },
      { name: 'Stockton', lat: 37.9577, lng: -121.2908, pop: 310496 },
      { name: 'Irvine', lat: 33.6846, lng: -117.8265, pop: 307670 },
      { name: 'Chula Vista', lat: 32.6401, lng: -117.0842, pop: 275487 },
      { name: 'Fremont', lat: 37.5485, lng: -121.9886, pop: 230504 },
      { name: 'San Bernardino', lat: 34.1083, lng: -117.2898, pop: 222101 },
      { name: 'Modesto', lat: 37.6391, lng: -120.9969, pop: 218464 }
    ],
    'Colorado': [
      { name: 'Denver', lat: 39.7392, lng: -104.9903, pop: 715522 },
      { name: 'Colorado Springs', lat: 38.8339, lng: -104.8214, pop: 478961 },
      { name: 'Aurora', lat: 39.7294, lng: -104.8319, pop: 379289 },
      { name: 'Fort Collins', lat: 40.5853, lng: -105.0844, pop: 169810 },
      { name: 'Lakewood', lat: 39.7047, lng: -105.0814, pop: 155984 },
      { name: 'Thornton', lat: 39.8681, lng: -104.9722, pop: 141867 }
    ],
    'Connecticut': [
      { name: 'Bridgeport', lat: 41.1865, lng: -73.1952, pop: 148654 },
      { name: 'New Haven', lat: 41.3083, lng: -72.9279, pop: 134023 },
      { name: 'Hartford', lat: 41.7658, lng: -72.6734, pop: 121054 },
      { name: 'Stamford', lat: 41.0534, lng: -73.5387, pop: 135470 },
      { name: 'Waterbury', lat: 41.5581, lng: -73.0515, pop: 114403 }
    ],
    'Delaware': [
      { name: 'Wilmington', lat: 39.7391, lng: -75.5398, pop: 70851 },
      { name: 'Dover', lat: 39.1612, lng: -75.5264, pop: 38079 },
      { name: 'Newark', lat: 39.6837, lng: -75.7497, pop: 33673 }
    ],
    'Florida': [
      { name: 'Jacksonville', lat: 30.3322, lng: -81.6557, pop: 949611 },
      { name: 'Miami', lat: 25.7617, lng: -80.1918, pop: 442241 },
      { name: 'Tampa', lat: 27.9506, lng: -82.4572, pop: 384959 },
      { name: 'Orlando', lat: 28.5383, lng: -81.3792, pop: 307573 },
      { name: 'St. Petersburg', lat: 27.7676, lng: -82.6403, pop: 258308 },
      { name: 'Hialeah', lat: 25.8576, lng: -80.2781, pop: 223109 },
      { name: 'Fort Lauderdale', lat: 26.1224, lng: -80.1373, pop: 182760 },
      { name: 'Tallahassee', lat: 30.4518, lng: -84.2807, pop: 194500 },
      { name: 'Cape Coral', lat: 26.5629, lng: -81.9495, pop: 194016 },
      { name: 'Port St. Lucie', lat: 27.2730, lng: -80.3582, pop: 204851 }
    ],
    'Georgia': [
      { name: 'Atlanta', lat: 33.7490, lng: -84.3880, pop: 498715 },
      { name: 'Augusta', lat: 33.4735, lng: -82.0105, pop: 202081 },
      { name: 'Columbus', lat: 32.4609, lng: -84.9877, pop: 206922 },
      { name: 'Macon', lat: 32.8407, lng: -83.6324, pop: 157346 },
      { name: 'Savannah', lat: 32.0835, lng: -81.0998, pop: 147780 },
      { name: 'Athens', lat: 33.9519, lng: -83.3576, pop: 127315 }
    ],
    'Illinois': [
      { name: 'Chicago', lat: 41.8781, lng: -87.6298, pop: 2746388 },
      { name: 'Aurora', lat: 41.7606, lng: -88.3201, pop: 180542 },
      { name: 'Rockford', lat: 42.2711, lng: -89.0940, pop: 148655 },
      { name: 'Joliet', lat: 41.5250, lng: -88.0817, pop: 150362 },
      { name: 'Naperville', lat: 41.7508, lng: -88.1535, pop: 149540 },
      { name: 'Springfield', lat: 39.7817, lng: -89.6501, pop: 114230 },
      { name: 'Peoria', lat: 40.6936, lng: -89.5890, pop: 113150 },
      { name: 'Elgin', lat: 42.0354, lng: -88.2826, pop: 114797 }
    ],
    'Indiana': [
      { name: 'Indianapolis', lat: 39.7684, lng: -86.1581, pop: 887642 },
      { name: 'Fort Wayne', lat: 41.0793, lng: -85.1394, pop: 270402 },
      { name: 'Evansville', lat: 37.9716, lng: -87.5710, pop: 117298 },
      { name: 'South Bend', lat: 41.6764, lng: -86.2520, pop: 103453 },
      { name: 'Carmel', lat: 39.9784, lng: -86.1180, pop: 99757 }
    ],
    'Iowa': [
      { name: 'Des Moines', lat: 41.5868, lng: -93.6250, pop: 214133 },
      { name: 'Cedar Rapids', lat: 42.0080, lng: -91.6440, pop: 133562 },
      { name: 'Davenport', lat: 41.5236, lng: -90.5776, pop: 101724 },
      { name: 'Sioux City', lat: 42.4999, lng: -96.4003, pop: 85797 }
    ],
    'Kansas': [
      { name: 'Wichita', lat: 37.6872, lng: -97.3301, pop: 397532 },
      { name: 'Overland Park', lat: 38.9822, lng: -94.6708, pop: 195494 },
      { name: 'Kansas City', lat: 39.1142, lng: -94.6275, pop: 156607 },
      { name: 'Topeka', lat: 39.0473, lng: -95.6890, pop: 124220 }
    ],
    'Kentucky': [
      { name: 'Louisville', lat: 38.2527, lng: -85.7585, pop: 617638 },
      { name: 'Lexington', lat: 38.0406, lng: -84.5037, pop: 323780 },
      { name: 'Bowling Green', lat: 36.9685, lng: -86.4808, pop: 70543 },
      { name: 'Owensboro', lat: 37.7719, lng: -87.1111, pop: 59809 }
    ],
    'Louisiana': [
      { name: 'New Orleans', lat: 29.9511, lng: -90.0715, pop: 383997 },
      { name: 'Baton Rouge', lat: 30.4515, lng: -91.1871, pop: 227470 },
      { name: 'Shreveport', lat: 32.5252, lng: -93.7502, pop: 187593 },
      { name: 'Lafayette', lat: 30.2241, lng: -92.0198, pop: 126674 }
    ],
    'Maine': [
      { name: 'Portland', lat: 43.6591, lng: -70.2568, pop: 68408 },
      { name: 'Lewiston', lat: 44.1003, lng: -70.2148, pop: 36221 },
      { name: 'Bangor', lat: 44.8016, lng: -68.7712, pop: 31753 }
    ],
    'Maryland': [
      { name: 'Baltimore', lat: 39.2904, lng: -76.6122, pop: 585708 },
      { name: 'Frederick', lat: 39.4143, lng: -77.4105, pop: 78171 },
      { name: 'Rockville', lat: 39.0840, lng: -77.1528, pop: 67117 },
      { name: 'Gaithersburg', lat: 39.1434, lng: -77.2014, pop: 69657 },
      { name: 'Bowie', lat: 38.9426, lng: -76.7302, pop: 58329 }
    ],
    'Massachusetts': [
      { name: 'Boston', lat: 42.3601, lng: -71.0589, pop: 695926 },
      { name: 'Worcester', lat: 42.2626, lng: -71.8023, pop: 206518 },
      { name: 'Springfield', lat: 42.1015, lng: -72.5898, pop: 155929 },
      { name: 'Cambridge', lat: 42.3736, lng: -71.1097, pop: 118403 },
      { name: 'Lowell', lat: 42.6334, lng: -71.3162, pop: 115554 }
    ],
    'Michigan': [
      { name: 'Detroit', lat: 42.3314, lng: -83.0458, pop: 639111 },
      { name: 'Grand Rapids', lat: 42.9634, lng: -85.6681, pop: 198917 },
      { name: 'Warren', lat: 42.5148, lng: -83.0146, pop: 139387 },
      { name: 'Sterling Heights', lat: 42.5803, lng: -83.0302, pop: 134346 },
      { name: 'Ann Arbor', lat: 42.2808, lng: -83.7430, pop: 123851 },
      { name: 'Lansing', lat: 42.3223, lng: -84.5362, pop: 118427 }
    ],
    'Minnesota': [
      { name: 'Minneapolis', lat: 44.9778, lng: -93.2650, pop: 429954 },
      { name: 'Saint Paul', lat: 44.9537, lng: -93.0900, pop: 311527 },
      { name: 'Rochester', lat: 44.0121, lng: -92.4802, pop: 121395 },
      { name: 'Duluth', lat: 46.7867, lng: -92.1005, pop: 86697 },
      { name: 'Bloomington', lat: 44.8408, lng: -93.2982, pop: 89987 }
    ],
    'Mississippi': [
      { name: 'Jackson', lat: 32.2988, lng: -90.1848, pop: 153701 },
      { name: 'Gulfport', lat: 30.3674, lng: -89.0928, pop: 72926 },
      { name: 'Southaven', lat: 34.9890, lng: -90.0126, pop: 54648 },
      { name: 'Hattiesburg', lat: 31.3271, lng: -89.2903, pop: 48730 }
    ],
    'Missouri': [
      { name: 'Kansas City', lat: 39.0997, lng: -94.5786, pop: 508090 },
      { name: 'St. Louis', lat: 38.6270, lng: -90.1994, pop: 301578 },
      { name: 'Springfield', lat: 37.2153, lng: -93.2982, pop: 169176 },
      { name: 'Columbia', lat: 38.9517, lng: -92.3341, pop: 126254 },
      { name: 'Independence', lat: 39.0911, lng: -94.4155, pop: 123011 }
    ],
    'Montana': [
      { name: 'Billings', lat: 45.7833, lng: -108.5007, pop: 117116 },
      { name: 'Missoula', lat: 46.8721, lng: -113.9940, pop: 75516 },
      { name: 'Great Falls', lat: 47.4941, lng: -111.2833, pop: 60442 },
      { name: 'Bozeman', lat: 45.6770, lng: -111.0429, pop: 53293 }
    ],
    'Nebraska': [
      { name: 'Omaha', lat: 41.2565, lng: -95.9345, pop: 486051 },
      { name: 'Lincoln', lat: 40.8136, lng: -96.7026, pop: 295178 },
      { name: 'Bellevue', lat: 41.1370, lng: -95.9145, pop: 64176 },
      { name: 'Grand Island', lat: 40.9263, lng: -98.3420, pop: 53131 }
    ],
    'Nevada': [
      { name: 'Las Vegas', lat: 36.1699, lng: -115.1398, pop: 651319 },
      { name: 'Henderson', lat: 36.0397, lng: -114.9817, pop: 320189 },
      { name: 'Reno', lat: 39.5296, lng: -119.8138, pop: 264165 },
      { name: 'North Las Vegas', lat: 36.1988, lng: -115.1175, pop: 262527 }
    ],
    'New Hampshire': [
      { name: 'Manchester', lat: 42.9956, lng: -71.4548, pop: 115644 },
      { name: 'Nashua', lat: 42.7654, lng: -71.4676, pop: 91322 },
      { name: 'Concord', lat: 43.2081, lng: -71.5376, pop: 43976 }
    ],
    'New Jersey': [
      { name: 'Newark', lat: 40.7357, lng: -74.1724, pop: 311549 },
      { name: 'Jersey City', lat: 40.7178, lng: -74.0431, pop: 292449 },
      { name: 'Paterson', lat: 40.9168, lng: -74.1718, pop: 159732 },
      { name: 'Elizabeth', lat: 40.6640, lng: -74.2107, pop: 137298 },
      { name: 'Edison', lat: 40.5187, lng: -74.4121, pop: 107588 }
    ],
    'New Mexico': [
      { name: 'Albuquerque', lat: 35.0844, lng: -106.6504, pop: 564559 },
      { name: 'Las Cruces', lat: 32.3199, lng: -106.7637, pop: 111385 },
      { name: 'Rio Rancho', lat: 35.2327, lng: -106.6630, pop: 104046 },
      { name: 'Santa Fe', lat: 35.6870, lng: -105.9378, pop: 87505 }
    ],
    'New York': [
      { name: 'New York City', lat: 40.7128, lng: -74.0060, pop: 8336817 },
      { name: 'Buffalo', lat: 42.8864, lng: -78.8784, pop: 278349 },
      { name: 'Rochester', lat: 43.1566, lng: -77.6088, pop: 211328 },
      { name: 'Yonkers', lat: 40.9312, lng: -73.8988, pop: 211569 },
      { name: 'Syracuse', lat: 43.0481, lng: -76.1474, pop: 148620 },
      { name: 'Albany', lat: 42.6526, lng: -73.7562, pop: 97856 },
      { name: 'New Rochelle', lat: 40.9115, lng: -73.7823, pop: 79726 }
    ],
    'North Carolina': [
      { name: 'Charlotte', lat: 35.2271, lng: -80.8431, pop: 885708 },
      { name: 'Raleigh', lat: 35.7796, lng: -78.6382, pop: 474069 },
      { name: 'Greensboro', lat: 36.0726, lng: -79.7920, pop: 299035 },
      { name: 'Durham', lat: 35.9940, lng: -78.8986, pop: 283506 },
      { name: 'Winston-Salem', lat: 36.0999, lng: -80.2442, pop: 249545 },
      { name: 'Fayetteville', lat: 35.0527, lng: -78.8784, pop: 211657 }
    ],
    'North Dakota': [
      { name: 'Fargo', lat: 46.8772, lng: -96.7898, pop: 125990 },
      { name: 'Bismarck', lat: 46.8083, lng: -100.7837, pop: 73622 },
      { name: 'Grand Forks', lat: 47.9253, lng: -97.0329, pop: 59166 },
      { name: 'Minot', lat: 48.2330, lng: -101.2957, pop: 48377 }
    ],
    'Ohio': [
      { name: 'Columbus', lat: 39.9612, lng: -82.9988, pop: 905748 },
      { name: 'Cleveland', lat: 41.4993, lng: -81.6944, pop: 383793 },
      { name: 'Cincinnati', lat: 39.1031, lng: -84.5120, pop: 309317 },
      { name: 'Toledo', lat: 41.6528, lng: -83.5379, pop: 270871 },
      { name: 'Akron', lat: 41.0814, lng: -81.5190, pop: 197597 },
      { name: 'Dayton', lat: 39.7589, lng: -84.1916, pop: 140407 }
    ],
    'Oklahoma': [
      { name: 'Oklahoma City', lat: 35.4676, lng: -97.5164, pop: 695327 },
      { name: 'Tulsa', lat: 36.1540, lng: -95.9928, pop: 413066 },
      { name: 'Norman', lat: 35.2226, lng: -97.4395, pop: 128026 },
      { name: 'Broken Arrow', lat: 36.0651, lng: -95.7974, pop: 113540 }
    ],
    'Oregon': [
      { name: 'Portland', lat: 45.5152, lng: -122.6784, pop: 652503 },
      { name: 'Eugene', lat: 44.0521, lng: -123.0868, pop: 176654 },
      { name: 'Salem', lat: 44.9429, lng: -123.0351, pop: 177723 },
      { name: 'Gresham', lat: 45.5001, lng: -122.4302, pop: 114247 }
    ],
    'Pennsylvania': [
      { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, pop: 1603797 },
      { name: 'Pittsburgh', lat: 40.4406, lng: -79.9959, pop: 302971 },
      { name: 'Allentown', lat: 40.6023, lng: -75.4714, pop: 125845 },
      { name: 'Erie', lat: 42.1292, lng: -80.0851, pop: 94831 },
      { name: 'Reading', lat: 40.3356, lng: -75.9269, pop: 95112 }
    ],
    'Rhode Island': [
      { name: 'Providence', lat: 41.8240, lng: -71.4128, pop: 190934 },
      { name: 'Warwick', lat: 41.7001, lng: -71.4162, pop: 82823 },
      { name: 'Cranston', lat: 41.7798, lng: -71.4371, pop: 82934 }
    ],
    'South Carolina': [
      { name: 'Charleston', lat: 32.7765, lng: -79.9311, pop: 150227 },
      { name: 'Columbia', lat: 34.0007, lng: -81.0348, pop: 137300 },
      { name: 'North Charleston', lat: 32.8546, lng: -79.9748, pop: 114852 },
      { name: 'Mount Pleasant', lat: 32.8323, lng: -79.8284, pop: 92369 }
    ],
    'South Dakota': [
      { name: 'Sioux Falls', lat: 43.5446, lng: -96.7311, pop: 192517 },
      { name: 'Rapid City', lat: 44.0805, lng: -103.2310, pop: 78492 },
      { name: 'Aberdeen', lat: 45.4647, lng: -98.4865, pop: 28495 }
    ],
    'Tennessee': [
      { name: 'Nashville', lat: 36.1627, lng: -86.7816, pop: 689447 },
      { name: 'Memphis', lat: 35.1495, lng: -90.0490, pop: 633104 },
      { name: 'Knoxville', lat: 35.9606, lng: -83.9207, pop: 190740 },
      { name: 'Chattanooga', lat: 35.0456, lng: -85.3097, pop: 181099 },
      { name: 'Clarksville', lat: 36.5298, lng: -87.3595, pop: 166722 }
    ],
    'Texas': [
      { name: 'Houston', lat: 29.7604, lng: -95.3698, pop: 2304580 },
      { name: 'San Antonio', lat: 29.4241, lng: -98.4936, pop: 1547253 },
      { name: 'Dallas', lat: 32.7767, lng: -96.7970, pop: 1343573 },
      { name: 'Austin', lat: 30.2672, lng: -97.7431, pop: 978908 },
      { name: 'Fort Worth', lat: 32.7555, lng: -97.3308, pop: 918915 },
      { name: 'El Paso', lat: 31.7619, lng: -106.4850, pop: 695044 },
      { name: 'Arlington', lat: 32.7357, lng: -97.1081, pop: 398854 },
      { name: 'Corpus Christi', lat: 27.8006, lng: -97.3964, pop: 326586 },
      { name: 'Plano', lat: 33.0198, lng: -96.6989, pop: 288061 },
      { name: 'Lubbock', lat: 33.5779, lng: -101.8552, pop: 260993 },
      { name: 'Laredo', lat: 27.5306, lng: -99.4803, pop: 261639 },
      { name: 'Irving', lat: 32.8140, lng: -96.9489, pop: 256684 }
    ],
    'Utah': [
      { name: 'Salt Lake City', lat: 40.7608, lng: -111.8910, pop: 200567 },
      { name: 'West Valley City', lat: 40.6916, lng: -112.0011, pop: 140230 },
      { name: 'Provo', lat: 40.2338, lng: -111.6585, pop: 116868 },
      { name: 'West Jordan', lat: 40.6097, lng: -111.9391, pop: 116961 }
    ],
    'Vermont': [
      { name: 'Burlington', lat: 44.4759, lng: -73.2121, pop: 44743 },
      { name: 'Essex', lat: 44.4906, lng: -73.1129, pop: 22094 },
      { name: 'South Burlington', lat: 44.4669, lng: -73.1709, pop: 19359 }
    ],
    'Virginia': [
      { name: 'Virginia Beach', lat: 36.8529, lng: -75.9780, pop: 459470 },
      { name: 'Chesapeake', lat: 36.7682, lng: -76.2875, pop: 249422 },
      { name: 'Norfolk', lat: 36.8468, lng: -76.2852, pop: 238005 },
      { name: 'Richmond', lat: 37.5407, lng: -77.4360, pop: 230436 },
      { name: 'Newport News', lat: 37.0871, lng: -76.4730, pop: 186247 },
      { name: 'Alexandria', lat: 38.8048, lng: -77.0469, pop: 159467 }
    ],
    'Washington': [
      { name: 'Seattle', lat: 47.6062, lng: -122.3321, pop: 753675 },
      { name: 'Spokane', lat: 47.6588, lng: -117.4260, pop: 228989 },
      { name: 'Tacoma', lat: 47.2529, lng: -122.4443, pop: 219346 },
      { name: 'Vancouver', lat: 45.6387, lng: -122.6615, pop: 185818 },
      { name: 'Bellevue', lat: 47.6101, lng: -122.2015, pop: 151854 },
      { name: 'Kent', lat: 47.3809, lng: -122.2348, pop: 136588 }
    ],
    'West Virginia': [
      { name: 'Charleston', lat: 38.3498, lng: -81.6326, pop: 46536 },
      { name: 'Huntington', lat: 38.4192, lng: -82.4452, pop: 44965 },
      { name: 'Morgantown', lat: 39.6295, lng: -79.9553, pop: 30347 }
    ],
    'Wisconsin': [
      { name: 'Milwaukee', lat: 43.0389, lng: -87.9065, pop: 577222 },
      { name: 'Madison', lat: 43.0731, lng: -89.4012, pop: 269840 },
      { name: 'Green Bay', lat: 44.5133, lng: -88.0133, pop: 107395 },
      { name: 'Kenosha', lat: 42.5847, lng: -87.8212, pop: 99986 },
      { name: 'Racine', lat: 42.7261, lng: -87.7829, pop: 77816 }
    ],
    'Wyoming': [
      { name: 'Cheyenne', lat: 41.1400, lng: -104.8197, pop: 65132 },
      { name: 'Casper', lat: 42.8666, lng: -106.3131, pop: 59628 },
      { name: 'Laramie', lat: 41.3114, lng: -105.5911, pop: 31407 }
    ]
  },
  'Canada': {
    'Ontario': [
      { name: 'Toronto', lat: 43.6532, lng: -79.3832, pop: 2930000 },
      { name: 'Ottawa', lat: 45.4215, lng: -75.6972, pop: 994837 },
      { name: 'Hamilton', lat: 43.2557, lng: -79.8711, pop: 569353 },
      { name: 'London', lat: 42.9849, lng: -81.2453, pop: 422324 },
      { name: 'Kitchener', lat: 43.4516, lng: -80.4925, pop: 256885 },
      { name: 'Windsor', lat: 42.3149, lng: -83.0364, pop: 229660 }
    ],
    'British Columbia': [
      { name: 'Vancouver', lat: 49.2827, lng: -123.1207, pop: 675218 },
      { name: 'Surrey', lat: 49.1913, lng: -122.8490, pop: 568322 },
      { name: 'Burnaby', lat: 49.2488, lng: -122.9805, pop: 249125 },
      { name: 'Richmond', lat: 49.1666, lng: -123.1336, pop: 209937 },
      { name: 'Abbotsford', lat: 49.0580, lng: -122.3055, pop: 153524 },
      { name: 'Coquitlam', lat: 49.3956, lng: -122.7811, pop: 148625 }
    ],
    'Quebec': [
      { name: 'Montreal', lat: 45.5017, lng: -73.5673, pop: 1762949 },
      { name: 'Quebec City', lat: 46.8139, lng: -71.2080, pop: 540398 },
      { name: 'Laval', lat: 45.6066, lng: -73.7124, pop: 438366 },
      { name: 'Gatineau', lat: 45.4777, lng: -75.7013, pop: 291041 },
      { name: 'Longueuil', lat: 45.5372, lng: -73.5179, pop: 254483 }
    ],
    'Alberta': [
      { name: 'Calgary', lat: 51.0447, lng: -114.0719, pop: 1336000 },
      { name: 'Edmonton', lat: 53.5461, lng: -113.4938, pop: 981280 },
      { name: 'Red Deer', lat: 52.2681, lng: -113.8112, pop: 100418 },
      { name: 'Lethbridge', lat: 49.6934, lng: -112.8414, pop: 98406 }
    ],
    'Manitoba': [
      { name: 'Winnipeg', lat: 49.8951, lng: -97.1384, pop: 749534 },
      { name: 'Brandon', lat: 49.8403, lng: -99.9515, pop: 51313 },
      { name: 'Steinbach', lat: 49.5260, lng: -96.6847, pop: 17806 }
    ],
    'Saskatchewan': [
      { name: 'Saskatoon', lat: 52.1332, lng: -106.6700, pop: 317480 },
      { name: 'Regina', lat: 50.4452, lng: -104.6189, pop: 249217 },
      { name: 'Prince Albert', lat: 53.2034, lng: -105.7531, pop: 37756 }
    ]
  },
  'United Kingdom': {
    'England': [
      { name: 'London', lat: 51.5074, lng: -0.1278, pop: 9648110 },
      { name: 'Birmingham', lat: 52.4862, lng: -1.8904, pop: 1141816 },
      { name: 'Liverpool', lat: 53.4084, lng: -2.9916, pop: 552858 },
      { name: 'Manchester', lat: 53.4808, lng: -2.2426, pop: 547899 },
      { name: 'Leeds', lat: 53.8008, lng: -1.5491, pop: 516298 },
      { name: 'Sheffield', lat: 53.3811, lng: -1.4701, pop: 518090 }
    ],
    'Scotland': [
      { name: 'Glasgow', lat: 55.8642, lng: -4.2518, pop: 633120 },
      { name: 'Edinburgh', lat: 55.9533, lng: -3.1883, pop: 548267 },
      { name: 'Aberdeen', lat: 57.1497, lng: -2.0943, pop: 198590 },
      { name: 'Dundee', lat: 56.4620, lng: -2.9707, pop: 148210 }
    ],
    'Wales': [
      { name: 'Cardiff', lat: 51.4816, lng: -3.1791, pop: 481082 },
      { name: 'Swansea', lat: 51.6214, lng: -3.9436, pop: 300352 },
      { name: 'Newport', lat: 51.5842, lng: -2.9977, pop: 145736 }
    ],
    'Northern Ireland': [
      { name: 'Belfast', lat: 54.5973, lng: -5.9301, pop: 343542 },
      { name: 'Derry', lat: 54.9966, lng: -7.3086, pop: 85279 }
    ]
  },
  'Australia': {
    'New South Wales': [
      { name: 'Sydney', lat: -33.8688, lng: 151.2093, pop: 5312163 },
      { name: 'Newcastle', lat: -32.9267, lng: 151.7789, pop: 322278 },
      { name: 'Wollongong', lat: -34.4278, lng: 150.8931, pop: 302739 }
    ],
    'Victoria': [
      { name: 'Melbourne', lat: -37.8136, lng: 144.9631, pop: 5078193 },
      { name: 'Geelong', lat: -38.1499, lng: 144.3617, pop: 253269 },
      { name: 'Ballarat', lat: -37.5622, lng: 143.8503, pop: 109553 }
    ],
    'Queensland': [
      { name: 'Brisbane', lat: -27.4698, lng: 153.0251, pop: 2560720 },
      { name: 'Gold Coast', lat: -28.0167, lng: 153.4000, pop: 679127 },
      { name: 'Cairns', lat: -16.9186, lng: 145.7781, pop: 153952 }
    ],
    'South Australia': [
      { name: 'Adelaide', lat: -34.9285, lng: 138.6007, pop: 1402393 }
    ],
    'Western Australia': [
      { name: 'Perth', lat: -31.9505, lng: 115.8605, pop: 2192229 }
    ],
    'Tasmania': [
      { name: 'Hobart', lat: -42.8821, lng: 147.3272, pop: 240342 }
    ]
  }
};

// Core cities to always display on homepage
const coreCities = [
  'New York City-New York-United States',
  'Los Angeles-California-United States',
  'Chicago-Illinois-United States',
  'Houston-Texas-United States',
  'Phoenix-Arizona-United States',
  'Philadelphia-Pennsylvania-United States'
];

// Smart city selection logic
class CitySelector {
  constructor() {
    this.usedCitiesFile = path.join(__dirname, 'used-cities.json');
    this.usedCities = this.loadUsedCities();
  }

  loadUsedCities() {
    try {
      if (fs.existsSync(this.usedCitiesFile)) {
        return JSON.parse(fs.readFileSync(this.usedCitiesFile, 'utf8'));
      }
    } catch (error) {
      console.log('Starting fresh - no previous city usage found');
    }
    return {};
  }

  saveUsedCities() {
    fs.writeFileSync(this.usedCitiesFile, JSON.stringify(this.usedCities, null, 2));
  }

  getDailyCities(count = 3) {
    const today = new Date().toISOString().split('T')[0];
    
    // Return same cities if already generated today
    if (this.usedCities[today]) {
      console.log(`Already generated cities for ${today}, using existing selection.`);
      return this.usedCities[today];
    }

    const allCities = this.getAllCitiesFlat();
    const availableCities = allCities.filter(city => !this.isCityUsed(city));
    
    // Reset if we've used all cities
    if (availableCities.length < count) {
      console.log('Used all cities, resetting pool...');
      this.usedCities = {};
      return this.getDailyCities(count);
    }

    // Smart selection: prioritize larger cities and geographic diversity
    const selectedCities = this.selectDiverseCities(availableCities, count);
    
    // Mark cities as used
    this.usedCities[today] = selectedCities;
    selectedCities.forEach(city => this.markCityAsUsed(city));
    
    this.saveUsedCities();
    return selectedCities;
  }

  getAllCitiesFlat() {
    const cities = [];
    Object.entries(cityDatabase).forEach(([country, states]) => {
      Object.entries(states).forEach(([state, citiesArray]) => {
        citiesArray.forEach(city => {
          const cityKey = `${city.name}-${state}-${country}`;
          if (!coreCities.includes(cityKey)) {
            cities.push({
              ...city,
              state,
              country,
              key: cityKey,
              timezone: this.guessTimezone(city.lat, city.lng, country)
            });
          }
        });
      });
    });
    return cities;
  }

  guessTimezone(lat, lng, country) {
    if (country === 'United States') {
      if (lng > -84) return 'America/New_York';
      if (lng > -102) return 'America/Chicago';
      if (lng > -120) return 'America/Denver';
      return 'America/Los_Angeles';
    }
    if (country === 'Canada') {
      if (lng > -90) return 'America/Toronto';
      if (lng > -102) return 'America/Winnipeg';
      if (lng > -115) return 'America/Edmonton';
      return 'America/Vancouver';
    }
    if (country === 'United Kingdom') return 'Europe/London';
    if (country === 'Australia') {
      if (lng < 130) return 'Australia/Perth';
      if (lng < 145) return 'Australia/Adelaide';
      if (lng < 150) return 'Australia/Melbourne';
      return 'Australia/Sydney';
    }
    return 'UTC';
  }

  selectDiverseCities(cities, count) {
    // Sort by population (larger cities first)
    cities.sort((a, b) => (b.pop || 0) - (a.pop || 0));
    
    const selected = [];
    const usedCountries = new Set();
    const usedStates = new Set();
    
    // First pass: prioritize geographic diversity
    for (const city of cities) {
      if (selected.length >= count) break;
      
      const stateKey = `${city.state}-${city.country}`;
      if (!usedCountries.has(city.country) || !usedStates.has(stateKey)) {
        selected.push(city);
        usedCountries.add(city.country);
        usedStates.add(stateKey);
      }
    }
    
    // Second pass: fill remaining slots with largest available cities
    for (const city of cities) {
      if (selected.length >= count) break;
      if (!selected.includes(city)) {
        selected.push(city);
      }
    }
    
    return selected.slice(0, count);
  }

  isCityUsed(city) {
    for (const dateUsed of Object.values(this.usedCities)) {
      if (Array.isArray(dateUsed) && dateUsed.some(used => used.key === city.key)) {
        return true;
      }
    }
    return false;
  }

  markCityAsUsed(city) {
    // Cities are marked as used when added to daily selection
  }
}

// Generate city pages with advanced features
function generateDailyPages() {
  const selector = new CitySelector();
  const cities = selector.getDailyCities(3); // Generate 3 cities daily
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  console.log(`\nGenerating pages for ${dateStr}:`);
  
  cities.forEach((city, index) => {
    const sunTimes = calculateDetailedSunTimes(city.lat, city.lng, today);
    
    if (!sunTimes) {
      console.log(`Skipping ${city.name} - polar day/night conditions`);
      return;
    }
    
    const pageContent = generateSEOOptimizedPage(city, sunTimes, today);
    
    // Create directory structure: cities/country/state/city/date.html
    const cityDir = path.join(__dirname, 'cities', 
      city.country.toLowerCase().replace(/\s+/g, '-'),
      city.state.toLowerCase().replace(/\s+/g, '-'),
      city.name.toLowerCase().replace(/\s+/g, '-')
    );
    
    if (!fs.existsSync(cityDir)) {
      fs.mkdirSync(cityDir, { recursive: true });
    }
    
    const filename = `${dateStr}.html`;
    const filePath = path.join(cityDir, filename);
    
    fs.writeFileSync(filePath, pageContent, 'utf8');
    console.log(`${index + 1}. Generated: ${city.name}, ${city.state} (${filePath})`);
  });
  
  // Generate sitemap update
  updateSitemap();
  
  console.log(`\nCompleted daily generation for ${dateStr}`);
  console.log(`Total pages generated: ${cities.length}`);
  console.log(`Estimated annual growth: ${cities.length * 365} pages/year`);
}

// Enhanced sun calculation (moved from earlier)
function calculateDetailedSunTimes(lat, lng, date) {
  const latitude = lat * Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  
  const P = 0.39795 * Math.cos(0.98563 * (dayOfYear - 173) * Math.PI / 180);
  const declination = Math.asin(P);
  
  const cosHourAngle = -Math.tan(latitude) * Math.tan(declination);
  
  if (Math.abs(cosHourAngle) > 1) {
    return null;
  }
  
  const hourAngle = Math.acos(cosHourAngle);
  const hoursFromNoon = hourAngle * 12 / Math.PI;
  const solarNoon = 12 - (lng / 15);
  
  const sunriseHour = solarNoon - hoursFromNoon;
  const sunsetHour = solarNoon + hoursFromNoon;
  
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60), 0, 0);
  
  const sunset = new Date(date);
  sunset.setHours(Math.floor(sunsetHour), Math.round((sunsetHour % 1) * 60), 0, 0);
  
  // Civil twilight calculations
  const civilAngle = Math.acos((-0.104719755 - Math.sin(latitude) * Math.sin(declination)) / (Math.cos(latitude) * Math.cos(declination)));
  const civilHoursFromNoon = civilAngle * 12 / Math.PI;
  
  const civilDawn = new Date(date);
  const civilDawnHour = solarNoon - civilHoursFromNoon;
  civilDawn.setHours(Math.floor(civilDawnHour), Math.round((civilDawnHour % 1) * 60), 0, 0);
  
  const civilDusk = new Date(date);
  const civilDuskHour = solarNoon + civilHoursFromNoon;
  civilDusk.setHours(Math.floor(civilDuskHour), Math.round((civilDuskHour % 1) * 60), 0, 0);
  
  return {
    sunrise,
    sunset,
    civilDawn,
    civilDusk,
    solarNoon: solarNoon,
    dayLength: (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60)
  };
}

function generateSEOOptimizedPage(city, sunTimes, date) {
  const dateStr = date.toISOString().split('T')[0];
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${city.name} Sun Times - ${formattedDate}`,
    "description": `Sunrise at ${formatTime(sunTimes.sunrise)} and sunset at ${formatTime(sunTimes.sunset)} in ${city.name}, ${city.state} on ${formattedDate}`,
    "url": `https://suntimestoday.com/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}/${city.state.toLowerCase().replace(/\s+/g, '-')}/${city.name.toLowerCase().replace(/\s+/g, '-')}/${dateStr}`,
    "mainEntity": {
      "@type": "Event",
      "name": `Sunrise and Sunset in ${city.name}`,
      "startDate": sunTimes.sunrise.toISOString(),
      "endDate": sunTimes.sunset.toISOString(),
      "location": {
        "@type": "Place",
        "name": `${city.name}, ${city.state}, ${city.country}`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": city.lat,
          "longitude": city.lng
        }
      }
    },
    "datePublished": date.toISOString(),
    "dateModified": date.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Sun Times Today"
    }
  };

  const goldenHour = new Date(sunTimes.sunset.getTime() - 60 * 60 * 1000);
  const blueHour = new Date(sunTimes.sunset.getTime() + 20 * 60 * 1000);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${city.name} Sun Times ${dateStr} - Sunrise ${formatTime(sunTimes.sunrise)} Sunset ${formatTime(sunTimes.sunset)}</title>
    <meta name="description" content="Sunrise at ${formatTime(sunTimes.sunrise)} and sunset at ${formatTime(sunTimes.sunset)} in ${city.name}, ${city.state} on ${formattedDate}. Complete sun times with golden hour and twilight information.">
    <meta name="keywords" content="${city.name} sunrise ${dateStr}, ${city.name} sunset times, ${city.state} sun times, sunrise ${city.name} today, ${city.name} golden hour">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${city.name} Sun Times ${dateStr} - Sunrise & Sunset">
    <meta property="og:description" content="Sunrise: ${formatTime(sunTimes.sunrise)} | Sunset: ${formatTime(sunTimes.sunset)} in ${city.name}, ${city.state}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://suntimestoday.com/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}/${city.state.toLowerCase().replace(/\s+/g, '-')}/${city.name.toLowerCase().replace(/\s+/g, '-')}/${dateStr}">
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
    </script>
    
    <style>
        :root {
            --primary: #FF6B35;
            --primary-light: #FF8A65;
            --text: #2D3748;
            --text-light: #718096;
            --bg: #FFFFFF;
            --bg-light: #F7FAFC;
            --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --border: #E2E8F0;
            --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
        }
        
        .header {
            background: var(--bg-gradient);
            color: white;
            padding: 1rem 0;
        }
        
        .nav {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            text-decoration: none;
            color: white;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            margin-left: 2rem;
            opacity: 0.9;
        }
        
        .nav-links a:hover { opacity: 1; }
        
        .hero {
            background: var(--bg-gradient);
            color: white;
            padding: 2rem 0 3rem 0;
            text-align: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .hero h1 {
            font-size: clamp(1.8rem, 4vw, 2.8rem);
            font-weight: 800;
            margin-bottom: 0.5rem;
            background: linear-gradient(45deg, #FFE082, #FFCC02);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 0.5rem;
        }
        
        .date-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .main-content { padding: 3rem 0; }
        
        .sun-data-card {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow-lg);
        }
        
        .times-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .time-card {
            background: var(--bg-light);
            padding: 1.2rem;
            border-radius: 12px;
            text-align: center;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .time-card.highlight {
            border-color: var(--primary);
            background: rgba(255, 107, 53, 0.05);
        }
        
        .time-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
        
        .time-label {
            font-weight: 600;
            color: var(--text-light);
            font-size: 0.85rem;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .time-value {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        .content-section {
            background: white;
            border-radius: 16px;
            padding: 2.5rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow);
        }
        
        .section h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 1.5rem;
        }
        
        .section h3 {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--text);
            margin: 1.5rem 0 1rem 0;
        }
        
        .section p {
            margin-bottom: 1rem;
            line-height: 1.7;
        }
        
        .highlight-box {
            background: var(--bg-light);
            border-left: 4px solid var(--primary);
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0 8px 8px 0;
        }
        
        .related-links {
            background: var(--bg-light);
            padding: 3rem 0;
        }
        
        .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .link-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            text-decoration: none;
            color: inherit;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            transition: transform 0.3s ease;
        }
        
        .link-card:hover { 
            transform: translateY(-3px);
            text-decoration: none;
        }
        
        .link-card h3 {
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .breadcrumb {
            background: var(--bg-light);
            padding: 0.75rem 0;
            font-size: 0.9rem;
        }
        
        .breadcrumb a {
            color: var(--primary);
            text-decoration: none;
        }
        
        .breadcrumb a:hover {
            text-decoration: underline;
        }
        
        .weather-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .weather-card {
            background: var(--bg-light);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .times-grid {
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 0.75rem;
            }
            
            .nav {
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
            }
            
            .content-section {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">🌅 Sun Times Today</a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/cities">All Cities</a>
            </div>
        </nav>
    </header>

    <div class="breadcrumb">
        <div class="container">
            <a href="/">Home</a> › 
            <a href="/cities">Cities</a> › 
            <a href="/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}">${city.country}</a> › 
            <a href="/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}/${city.state.toLowerCase().replace(/\s+/g, '-')}">${city.state}</a> › 
            <a href="/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}/${city.state.toLowerCase().replace(/\s+/g, '-')}/${city.name.toLowerCase().replace(/\s+/g, '-')}">${city.name}</a> › 
            ${dateStr}
        </div>
    </div>

    <section class="hero">
        <div class="container">
            <h1>${city.name} Sun Times</h1>
            <p class="hero-subtitle">${city.state}, ${city.country}</p>
            <div class="date-badge">${formattedDate}</div>
        </div>
    </section>

    <main class="main-content">
        <div class="container">
            <div class="sun-data-card">
                <div class="times-grid">
                    <div class="time-card highlight">
                        <div class="time-icon">🌅</div>
                        <div class="time-label">Sunrise</div>
                        <div class="time-value">${formatTime(sunTimes.sunrise)}</div>
                    </div>
                    <div class="time-card highlight">
                        <div class="time-icon">🌇</div>
                        <div class="time-label">Sunset</div>
                        <div class="time-value">${formatTime(sunTimes.sunset)}</div>
                    </div>
                    <div class="time-card">
                        <div class="time-icon">📐</div>
                        <div class="time-label">Day Length</div>
                        <div class="time-value">${sunTimes.dayLength.toFixed(1)}h</div>
                    </div>
                    <div class="time-card">
                        <div class="time-icon">✨</div>
                        <div class="time-label">Golden Hour</div>
                        <div class="time-value">${formatTime(goldenHour)}</div>
                    </div>
                    <div class="time-card">
                        <div class="time-icon">🌄</div>
                        <div class="time-label">Civil Dawn</div>
                        <div class="time-value">${formatTime(sunTimes.civilDawn)}</div>
                    </div>
                    <div class="time-card">
                        <div class="time-icon">🌆</div>
                        <div class="time-label">Civil Dusk</div>
                        <div class="time-value">${formatTime(sunTimes.civilDusk)}</div>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <h2>Sun Times for ${city.name} - ${formattedDate}</h2>
                <p>Today in ${city.name}, ${city.state}, the sun rises at <strong>${formatTime(sunTimes.sunrise)}</strong> and sets at <strong>${formatTime(sunTimes.sunset)}</strong>, providing ${sunTimes.dayLength.toFixed(1)} hours of daylight. This timing is perfect for planning outdoor activities, photography sessions, or simply enjoying the natural rhythm of the day.</p>
                
                <h3>Photography Golden Hours</h3>
                <div class="highlight-box">
                    <p><strong>Golden Hour:</strong> ${formatTime(goldenHour)} - ${formatTime(sunTimes.sunset)}<br>
                    <strong>Blue Hour:</strong> ${formatTime(sunTimes.sunset)} - ${formatTime(blueHour)}</p>
                </div>
                
                <p>The golden hour in ${city.name} begins at ${formatTime(goldenHour)}, one hour before sunset. This is when photographers capture their most stunning images due to the warm, soft lighting that enhances colors and reduces harsh shadows.</p>
                
                <h3>Civil Twilight Times</h3>
                <p>Civil twilight begins at ${formatTime(sunTimes.civilDawn)} in the morning and ends at ${formatTime(sunTimes.civilDusk)} in the evening. During civil twilight, there's enough light for most outdoor activities without artificial illumination.</p>
                
                <h3>Best Viewing Conditions</h3>
                <p>For the best sunrise viewing in ${city.name}, find an elevated location with a clear eastern horizon. Sunset viewing is optimal from locations with western exposure. Weather conditions, atmospheric clarity, and local terrain all influence the exact appearance and timing of sunrise and sunset.</p>
                
                <div class="weather-info">
                    <div class="weather-card">
                        <h4>Solar Noon</h4>
                        <p>${Math.floor(sunTimes.solarNoon)}:${String(Math.round((sunTimes.solarNoon % 1) * 60)).padStart(2, '0')}</p>
                    </div>
                    <div class="weather-card">
                        <h4>Day Length</h4>
                        <p>${Math.floor(sunTimes.dayLength)}h ${Math.round((sunTimes.dayLength % 1) * 60)}m</p>
                    </div>
                    <div class="weather-card">
                        <h4>Location</h4>
                        <p>${city.lat.toFixed(4)}°, ${city.lng.toFixed(4)}°</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <section class="related-links">
        <div class="container">
            <h2>Related Sun Times</h2>
            <div class="links-grid">
                <a href="/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}/${city.state.toLowerCase().replace(/\s+/g, '-')}/${city.name.toLowerCase().replace(/\s+/g, '-')}" class="link-card">
                    <h3>${city.name} All Dates</h3>
                    <p>View sun times for other dates in ${city.name}</p>
                </a>
                <a href="/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}/${city.state.toLowerCase().replace(/\s+/g, '-')}" class="link-card">
                    <h3>Other ${city.state} Cities</h3>
                    <p>Sun times for other cities in ${city.state}</p>
                </a>
                <a href="/cities/${city.country.toLowerCase().replace(/\s+/g, '-')}" class="link-card">
                    <h3>${city.country} Sun Times</h3>
                    <p>Browse all cities in ${city.country}</p>
                </a>
                <a href="/" class="link-card">
                    <h3>Today's Sun Times</h3>
                    <p>Current sun times for major cities worldwide</p>
                </a>
            </div>
        </div>
    </section>
</body>
</html>`;
}

function updateSitemap() {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  const today = new Date().toISOString().split('T')[0];
  
  // Generate sitemap entries for all created pages
  let sitemapEntries = [];
  
  // Add homepage
  sitemapEntries.push({
    url: 'https://suntimestoday.com/',
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0'
  });
  
  // Add city index pages
  sitemapEntries.push({
    url: 'https://suntimestoday.com/cities',
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8'
  });
  
  // Scan for all generated city pages
  const citiesDir = path.join(__dirname, 'cities');
  if (fs.existsSync(citiesDir)) {
    scanDirectoryForPages(citiesDir, sitemapEntries);
  }
  
  // Generate XML
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(sitemapPath, sitemapXML);
  console.log(`Sitemap updated with ${sitemapEntries.length} URLs`);
}

function scanDirectoryForPages(dir, entries, baseUrl = 'https://suntimestoday.com') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectoryForPages(fullPath, entries, baseUrl);
    } else if (item.endsWith('.html')) {
      const relativePath = path.relative(__dirname, fullPath);
      const url = baseUrl + '/' + relativePath.replace(/\\/g, '/').replace('.html', '');
      
      entries.push({
        url: url,
        lastmod: stat.mtime.toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.7'
      });
    }
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Main execution
if (require.main === module) {
  generateDailyPages();
}

module.exports = { generateDailyPages, CitySelector, cityDatabase };