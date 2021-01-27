const API_IP = 'http://192.168.1.16:3000';

export const getAllGroups = () => {
  try {
    const data = fetch(API_IP + '/groups');
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroupElements = async groupId => {
  try {
    const data = await fetch(API_IP + `/groups/${groupId}/elements`);

    return await data.json();
  } catch (error) {
    console.log(error);
  }
};

export const getAllThermometers = async () => {
  try {
    const data = await fetch(API_IP + `/thermometers`);

    return await data.json();
  } catch (error) {
    console.log(error);
  }
};
