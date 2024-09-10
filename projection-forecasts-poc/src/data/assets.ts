export const assets: Asset[] = [
  {
    assetId: 1,
    assetName: 'EV_CHARGING_NORTH',
    availableCapacityMW: 1.56,
    start: 'Wed Sep 11 2024 06:57:14 GMT+0100 (British Summer Time)',
    end: 'Thu Sep 12 2024 08:57:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 2,
    assetName: 'EV_CHARGING_SOUTH',
    availableCapacityMW: 1.39,
    start: 'Sat Sep 14 2024 20:33:14 GMT+0100 (British Summer Time)',
    end: 'Sun Sep 15 2024 08:33:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 3,
    assetName: 'SOLAR_FARM_EAST',
    availableCapacityMW: 4.99,
    start: 'Sat Sep 14 2024 08:14:14 GMT+0100 (British Summer Time)',
    end: 'Sun Sep 15 2024 03:14:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 4,
    assetName: 'SOLAR_FARM_WEST',
    availableCapacityMW: 4.88,
    start: 'Thu Sep 12 2024 23:57:14 GMT+0100 (British Summer Time)',
    end: 'Sat Sep 14 2024 03:57:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 5,
    assetName: 'WIND_TURBINE_A',
    availableCapacityMW: 4.92,
    start: 'Tue Sep 17 2024 03:48:14 GMT+0100 (British Summer Time)',
    end: 'Wed Sep 18 2024 03:48:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 6,
    assetName: 'WIND_TURBINE_B',
    availableCapacityMW: 4.63,
    start: 'Thu Sep 19 2024 00:12:14 GMT+0100 (British Summer Time)',
    end: 'Fri Sep 20 2024 06:12:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 7,
    assetName: 'HYDRO_PLANT_X',
    availableCapacityMW: 1.35,
    start: 'Thu Sep 19 2024 22:29:14 GMT+0100 (British Summer Time)',
    end: 'Fri Sep 20 2024 14:29:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 8,
    assetName: 'HYDRO_PLANT_Y',
    availableCapacityMW: 2.86,
    start: 'Thu Sep 12 2024 01:10:14 GMT+0100 (British Summer Time)',
    end: 'Fri Sep 13 2024 09:10:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 9,
    assetName: 'BATTERY_STORAGE_A',
    availableCapacityMW: 4.16,
    start: 'Sat Sep 14 2024 23:28:14 GMT+0100 (British Summer Time)',
    end: 'Mon Sep 16 2024 06:28:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 10,
    assetName: 'BATTERY_STORAGE_B',
    availableCapacityMW: 3.22,
    start: 'Tue Sep 17 2024 05:18:14 GMT+0100 (British Summer Time)',
    end: 'Tue Sep 17 2024 21:18:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 11,
    assetName: 'COAL_PLANT',
    availableCapacityMW: 0.24,
    start: 'Wed Sep 11 2024 05:15:14 GMT+0100 (British Summer Time)',
    end: 'Wed Sep 11 2024 19:15:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 12,
    assetName: 'GAS_TURBINE_1',
    availableCapacityMW: 1.68,
    start: 'Sat Sep 21 2024 03:14:14 GMT+0100 (British Summer Time)',
    end: 'Sun Sep 22 2024 14:14:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 13,
    assetName: 'GAS_TURBINE_2',
    availableCapacityMW: 3.24,
    start: 'Mon Sep 16 2024 18:02:14 GMT+0100 (British Summer Time)',
    end: 'Tue Sep 17 2024 11:02:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 14,
    assetName: 'NUCLEAR_REACTOR',
    availableCapacityMW: 4.98,
    start: 'Wed Sep 18 2024 09:21:14 GMT+0100 (British Summer Time)',
    end: 'Thu Sep 19 2024 05:21:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
  {
    assetId: 15,
    assetName: 'BIOFUEL_GENERATOR',
    availableCapacityMW: 4.12,
    start: 'Wed Sep 18 2024 04:00:14 GMT+0100 (British Summer Time)',
    end: 'Thu Sep 19 2024 10:00:14 GMT+0100 (British Summer Time)',
    fullname: '',
  },
];

interface Asset {
  assetId: number;
  assetName: string;
  availableCapacityMW: number;
  start: string;
  end: string;
  fullname: string;
}
