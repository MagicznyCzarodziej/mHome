// import {
//   GroupCreateInput,
//   LightCreateInput,
//   ThermometerCreateInput,
//   ReedCreateInput,
// } from '@prisma/client';
// import { database } from 'database/database';

// const groups: GroupCreateInput[] = [
//   {
//     id: 'KITCHEN',
//     name: 'Kuchnia',
//     icon: 'silverware',
//   },
//   {
//     id: 'BEDROOM',
//     name: 'Sypialnia',
//   },
//   {
//     id: 'BATHROOM',
//     name: 'Łazienki / Pralnia',
//     description: 'Jakiś pokój A',
//   },
//   {
//     id: 'ROOM_A',
//     name: 'Pokój A',
//     description: 'Jakiś pokój A',
//   },
//   {
//     id: 'LIVING_ROOM',
//     name: 'Salon',
//     description: 'Salon i tyle',
//     icon: 'sofa',
//   },
//   {
//     id: 'ROOM_B',
//     name: 'Pokój B',
//     description: 'Jakiś pokój B',
//   },
//   {
//     id: 'GARAGE_AND_OTHERS',
//     name: 'Garaż / Kotłownia',
//   },
//   {
//     id: 'VESTIBULE',
//     name: 'Ganek / Korytarz',
//   },
//   {
//     id: 'OUTSIDE',
//     name: 'Dwór',
//   },
// ];

// const lights: LightCreateInput[] = [
//   {
//     id: 0,
//     name: 'Światełko 0',
//     description: 'Jakieś światło DEF ON',
//     state: 'ON',
//     group: {
//       connect: {
//         id: 'LIVING_ROOM',
//       },
//     },
//   },
//   {
//     id: 1,
//     name: 'Światełko 1',
//     description: 'Jakieś światło DEF OFF',
//     state: 'OFF',
//     group: {
//       connect: {
//         id: 'LIVING_ROOM',
//       },
//     },
//   },
// ];

// const thermometers: ThermometerCreateInput[] = [
//   {
//     id: 0,
//     name: 'Termometr wewnętrzny',
//     latestTemperature: 0,
//     group: {
//       connect: {
//         id: 'LIVING_ROOM',
//       },
//     },
//   },
//   {
//     id: 1,
//     name: 'Termometr zewnętrzny',
//     latestTemperature: 0,
//     group: {
//       connect: {
//         id: 'LIVING_ROOM',
//       },
//     },
//   },
// ];

// const reeds: ReedCreateInput[] = [
//   {
//     id: 0,
//     name: 'Okno',
//     group: {
//       connect: {
//         id: 'LIVING_ROOM',
//       },
//     },
//   },
//   {
//     id: 1,
//     name: 'Drzwi tarasowe',
//     group: {
//       connect: {
//         id: 'LIVING_ROOM',
//       },
//     },
//   },
//   {
//     id: 2,
//     name: 'Okno',
//     group: {
//       connect: {
//         id: 'ROOM_A',
//       },
//     },
//   },
// ];

// export async function seed() {
//   try {
//     // Groups
//     await Promise.all(
//       groups.map((group) =>
//         database.group.create({
//           data: group,
//         }),
//       ),
//     );

//     // Lights
//     await Promise.all(
//       lights.map((light) =>
//         database.light.create({
//           data: light,
//         }),
//       ),
//     );

//     // Thermometers
//     await Promise.all(
//       thermometers.map((thermometer) =>
//         database.thermometer.create({
//           data: thermometer,
//         }),
//       ),
//     );

//     // Reeds
//     await Promise.all(
//       reeds.map((reed) =>
//         database.reed.create({
//           data: reed,
//         }),
//       ),
//     );
//   } catch (error) {
//     console.log('Błąd');
//   }
// }

// seed();
