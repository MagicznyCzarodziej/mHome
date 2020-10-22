import {
  GroupCreateInput,
  LightCreateInput,
  ThermometerCreateInput,
} from '@prisma/client';
import { database } from 'database/database';

const groups: GroupCreateInput[] = [
  {
    id: 'LIVING_ROOM',
    name: 'Salon',
    description: 'Salon i tyle',
    icon: 'sofa',
  },
  {
    id: 'KITCHEN',
    name: 'Kuchnia',
    icon: 'silverware',
  },
  {
    id: 'OUTSIDE',
    name: 'Dwór',
  },
  {
    id: 'ROOM_1',
    name: 'Pokój 1',
    description: 'Jakiś pokój nr 1',
  },
];

const lights: LightCreateInput[] = [
  {
    id: 'LIGHT_000',
    name: 'Światełko 0',
    description: 'Jakieś światło DEF ON',
    state: 'ON',
    group: {
      connect: {
        id: 'LIVING_ROOM',
      },
    },
  },
  {
    id: 'LIGHT_001',
    name: 'Światełko 1',
    description: 'Jakieś światło DEF OFF',
    state: 'OFF',
    group: {
      connect: {
        id: 'LIVING_ROOM',
      },
    },
  },
];

const thermometers: ThermometerCreateInput[] = [
  {
    id: 'THERMOMETER_000',
    name: 'Termometr wewnętrzny',
    latestTemperature: 0,
    group: {
      connect: {
        id: 'LIVING_ROOM',
      },
    },
  },
  {
    id: 'THERMOMETER_001',
    name: 'Termometr zewnętrzny',
    latestTemperature: 0,
    group: {
      connect: {
        id: 'LIVING_ROOM',
      },
    },
  },
];

export async function seed() {
  try {
    // Groups
    Promise.all(
      groups.map((group) =>
        database.group.create({
          data: group,
        })
      )
    );

    // Lights
    await Promise.all(
      lights.map((light) =>
        database.light.create({
          data: light,
        })
      )
    );

    // Thermometers
    await Promise.all(
      thermometers.map((thermometer) =>
        database.thermometer.create({
          data: thermometer,
        })
      )
    );
  } catch (error) {
    console.log('Błąd');
  }
}

seed();
